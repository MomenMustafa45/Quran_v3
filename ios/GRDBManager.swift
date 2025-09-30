import Foundation
import GRDB
import React

@objc(GRDBManager)
class GRDBManager: NSObject {
  
  private var dbQueue: DatabaseQueue?
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  private func getDatabasePath() -> String? {
    
    
    // Try different possible locations
    let possiblePaths = [
      // If file is in blue 'res' folder reference
      Bundle.main.path(forResource: "quran_arabic", ofType: "db", inDirectory: "res"),
      // If file is directly in main bundle
      Bundle.main.path(forResource: "quran_arabic", ofType: "db"),
    ]
    
    for path in possiblePaths {
      if let validPath = path, FileManager.default.fileExists(atPath: validPath) {
        print("✅ Found database at: \(validPath)")
        return validPath
      }
    }
    
    // Debug: Print bundle contents
    print("🔍 Debug: Searching for database file...")
    if let resourcePath = Bundle.main.resourcePath {
      do {
        let files = try FileManager.default.contentsOfDirectory(atPath: resourcePath)
        print("📁 Files in main bundle: \(files)")
      } catch {
        print("❌ Error listing bundle: \(error)")
      }
    }
    
    // Check res folder specifically
    if let resPath = Bundle.main.path(forResource: "", ofType: nil, inDirectory: "res") {
      do {
        let resFiles = try FileManager.default.contentsOfDirectory(atPath: resPath)
        print("📁 Files in res folder: \(resFiles)")
      } catch {
        print("📁 res folder contents: \(error)")
      }
    } else {
      print("❌ res folder not found in bundle")
    }
    
    return nil
  }
  
  private func openDatabase() throws -> DatabaseQueue {
    if let dbQueue = dbQueue {
      return dbQueue
    }
    
    guard let dbPath = getDatabasePath() else {
      throw NSError(domain: "GRDBManager", code: 1, userInfo: [NSLocalizedDescriptionKey: "Database file not found in app bundle. Check that quran_arabic.db is added to the project in a 'res' folder."])
    }
    
    print("🚀 Opening database at: \(dbPath)")
    let queue = try DatabaseQueue(path: dbPath)
    self.dbQueue = queue
    return queue
  }
  
  @objc
  func openDatabase(_ resolve: @escaping RCTPromiseResolveBlock,
                    rejecter: @escaping RCTPromiseRejectBlock) {
    do {
      _ = try openDatabase()
      resolve(true)
    } catch {
      print("❌ Database opening error: \(error)")
      rejecter("DATABASE_ERROR", "Failed to open database: \(error.localizedDescription)", error)
    }
  }
  
  @objc
  func closeDatabase(_ resolve: @escaping RCTPromiseResolveBlock,
                     rejecter: @escaping RCTPromiseRejectBlock) {
    dbQueue = nil
    resolve(true)
  }
  
  @objc
  func executeQuery(_ query: String,
                   parameters: [String: Any]?,
                   resolver: @escaping RCTPromiseResolveBlock,
                   rejecter: @escaping RCTPromiseRejectBlock) {
    
    do {
      let dbQueue = try openDatabase()
      
      try dbQueue.read { db in
        // Convert parameters to array in correct order
        var arguments: [DatabaseValueConvertible] = []
        if let params = parameters {
          // Sort parameters by key to maintain order (param1, param2, param3...)
          let sortedParams = params.sorted { $0.key < $1.key }
          for (_, value) in sortedParams {
            if let stringValue = value as? String {
              arguments.append(stringValue)
            } else if let intValue = value as? Int {
              arguments.append(intValue)
            } else if let doubleValue = value as? Double {
              arguments.append(doubleValue)
            } else if let boolValue = value as? Bool {
              arguments.append(boolValue)
            } else if value is NSNull {
              arguments.append(Optional<String>.none as DatabaseValueConvertible)
            }
          }
        }
        
        let rows = try Row.fetchAll(db, sql: query, arguments: StatementArguments(arguments))
        let results = rows.map { row in
          return row.toDictionary()
        }
        
        resolver([
          "rows": results,
          "rowsAffected": results.count,
          "insertId": -1
        ])
      }
    } catch {
      print("❌ Database query error: \(error)")
      rejecter("DATABASE_ERROR", error.localizedDescription, error)
    }
  }
  
  @objc
  func executeRawQuery(_ query: String,
                      resolver: @escaping RCTPromiseResolveBlock,
                      rejecter: @escaping RCTPromiseRejectBlock) {
    
    do {
      let dbQueue = try openDatabase()
      
      try dbQueue.write { db in
        try db.execute(sql: query)
        let response: [String: Any] = [
          "rowsAffected": db.changesCount,
          "insertId": db.lastInsertedRowID
        ]
        resolver(response)
      }
    } catch {
      rejecter("DATABASE_ERROR", "Raw query execution failed: \(error.localizedDescription)", error)
    }
  }
  
  @objc
  func isDatabaseOpen(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter: @escaping RCTPromiseRejectBlock) {
    resolve(dbQueue != nil)
  }
}

// Extension to convert Row to Dictionary
extension Row {
  func toDictionary() -> [String: Any] {
    var dict: [String: Any] = [:]
    for column in self.columnNames {
      let value = self[column]
      switch value {
      case let string as String: dict[column] = string
      case let int as Int: dict[column] = int
      case let int64 as Int64: dict[column] = Int(int64)
      case let double as Double: dict[column] = double
      case let bool as Bool: dict[column] = bool
      case let data as Data: dict[column] = data.base64EncodedString()
      case .none: dict[column] = NSNull()
      default: dict[column] = String(describing: value)
      }
    }
    return dict
  }
}
