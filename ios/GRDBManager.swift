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

    let possiblePaths = [
      Bundle.main.path(forResource: "quran_arabic2", ofType: "db", inDirectory: "res"),
      Bundle.main.path(forResource: "quran_arabic2", ofType: "db")
    ]

    for path in possiblePaths {
      if let validPath = path,
         FileManager.default.fileExists(atPath: validPath) {
        return validPath
      }
    }

    return nil
  }

  private func openDatabaseInternal() throws -> DatabaseQueue {

    if let dbQueue = dbQueue {
      return dbQueue
    }

    guard let dbPath = getDatabasePath() else {
      throw NSError(
        domain: "GRDBManager",
        code: 1,
        userInfo: [NSLocalizedDescriptionKey: "Database file not found"]
      )
    }

    let queue = try DatabaseQueue(path: dbPath)
    self.dbQueue = queue

    return queue
  }

  @objc
  func openDatabase(_ resolve: @escaping RCTPromiseResolveBlock,
                    rejecter reject: @escaping RCTPromiseRejectBlock) {

    do {
      _ = try openDatabaseInternal()
      resolve(true)
    } catch {
      reject("DATABASE_ERROR", error.localizedDescription, error)
    }
  }

  @objc
  func closeDatabase(_ resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {

    dbQueue = nil
    resolve(true)
  }

  @objc
  func isDatabaseOpen(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {

    resolve(dbQueue != nil)
  }

  @objc
  func executeQuery(_ query: String,
                    parameters: [String: Any]?,
                    resolver resolve: @escaping RCTPromiseResolveBlock,
                    rejecter reject: @escaping RCTPromiseRejectBlock) {

    do {

      let dbQueue = try openDatabaseInternal()

      try dbQueue.read { db in

        var arguments: [DatabaseValueConvertible] = []

        if let params = parameters {

          let sortedParams = params.sorted { $0.key < $1.key }

          for (_, value) in sortedParams {

            switch value {

            case let v as String:
              arguments.append(v)

            case let v as Int:
              arguments.append(v)

            case let v as Double:
              arguments.append(v)

            case let v as Bool:
              arguments.append(v)

            default:
              arguments.append(Optional<String>.none as DatabaseValueConvertible)
            }
          }
        }

        let rows = try Row.fetchAll(
          db,
          sql: query,
          arguments: StatementArguments(arguments)
        )

        let resultRows = rows.map { $0.toDictionary() }

        resolve([
          "rows": resultRows,
          "rowsAffected": resultRows.count,
          "insertId": -1
        ])
      }

    } catch {
      reject("DATABASE_ERROR", error.localizedDescription, error)
    }
  }

  @objc
  func executeRawQuery(_ query: String,
                       resolver resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {

    do {

      let dbQueue = try openDatabaseInternal()

      try dbQueue.write { db in

        try db.execute(sql: query)

        resolve([
          "rowsAffected": db.changesCount,
          "insertId": db.lastInsertedRowID
        ])
      }

    } catch {
      reject("DATABASE_ERROR", error.localizedDescription, error)
    }
  }
}

extension Row {

  func toDictionary() -> [String: Any] {

    var dict: [String: Any] = [:]

    for column in columnNames {

      let value = self[column]

      switch value {

      case let v as String: dict[column] = v
      case let v as Int: dict[column] = v
      case let v as Int64: dict[column] = Int(v)
      case let v as Double: dict[column] = v
      case let v as Bool: dict[column] = v
      case let v as Data:
        dict[column] = v.base64EncodedString()

      case .none:
        dict[column] = NSNull()

      default:
        dict[column] = "\(value)"
      }
    }

    return dict
  }
}