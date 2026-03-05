package com.forsa_quran.database

import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteException
import android.util.Log
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.util.*

class GRDBManagerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var database: SQLiteDatabase? = null
    private val reactContext: ReactApplicationContext = reactContext

    companion object {
        private const val TAG = "GRDBManager"
        private const val DATABASE_NAME = "quran_arabic2.db"
    }

    override fun getName(): String = "GRDBManager"

    override fun initialize() {
        super.initialize()
        // Don't auto-open database, let the JS side handle it
    }

    override fun getConstants(): MutableMap<String, Any>? {
        return hashMapOf()
    }

    private fun getDatabasePath(): String {
        return reactContext.getDatabasePath(DATABASE_NAME).absolutePath
    }

    @Throws(IOException::class)
    private fun copyDatabaseFromAssets(): Boolean {
        val dbPath = getDatabasePath()
        val dbFile = File(dbPath)

        // Check if database already exists and is valid
        if (dbFile.exists()) {
            // Optional: Check if database is valid by trying to open it
            try {
                SQLiteDatabase.openDatabase(dbPath, null, SQLiteDatabase.OPEN_READONLY).close()
                return true
            } catch (e: SQLiteException) {
                // Database is corrupted, delete it and copy again
                Log.w(TAG, "Existing database is corrupted, replacing...")
                dbFile.delete()
            }
        }

        // Create parent directories if they don't exist
        dbFile.parentFile?.mkdirs()

        // Try different possible asset paths
        val assetPaths = listOf(
            "res/$DATABASE_NAME",  // In res folder
            DATABASE_NAME,          // Directly in assets
            "databases/$DATABASE_NAME", // In databases folder
            "db/$DATABASE_NAME"     // In db folder
        )

        var copied = false
        var lastException: IOException? = null

        for (assetPath in assetPaths) {
            try {
                reactContext.assets.open(assetPath).use { inputStream ->
                    FileOutputStream(dbPath).use { outputStream ->
                        val buffer = ByteArray(8192)
                        var length: Int
                        while (inputStream.read(buffer).also { length = it } > 0) {
                            outputStream.write(buffer, 0, length)
                        }
                        outputStream.flush()
                    }
                }
                Log.i(TAG, "Successfully copied database from assets: $assetPath")
                copied = true
                break
            } catch (e: IOException) {
                lastException = e
                // Continue to next path
            }
        }

        if (!copied) {
            // Debug: List all assets to help identify the correct path
            try {
                val assets = reactContext.assets.list("")
                Log.e(TAG, "Available assets: ${assets?.joinToString()}")
                
                // Try to list res folder if it exists
                try {
                    val resAssets = reactContext.assets.list("res")
                    Log.e(TAG, "Assets in 'res' folder: ${resAssets?.joinToString()}")
                } catch (e: IOException) {
                    Log.e(TAG, "No 'res' folder in assets")
                }
            } catch (e: IOException) {
                Log.e(TAG, "Failed to list assets", e)
            }
            
            throw lastException ?: IOException("Database file not found in assets. Check that $DATABASE_NAME exists in assets folder")
        }

        return true
    }

    @Throws(SQLiteException::class, IOException::class)
    private fun openDatabase(): SQLiteDatabase {
        // Return existing database if it's open
        database?.let { db ->
            if (db.isOpen) {
                return db
            }
        }

        // Ensure database file exists
        copyDatabaseFromAssets()

        // Open the database
        database = SQLiteDatabase.openDatabase(
            getDatabasePath(),
            null,
            SQLiteDatabase.OPEN_READWRITE
        )

        // Enable foreign keys for better data integrity
        database?.execSQL("PRAGMA foreign_keys=ON;")

        return database!!
    }

    @ReactMethod
    fun openDatabase(promise: Promise) {
        try {
            openDatabase()
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to open database", e)
            promise.reject("DATABASE_ERROR", "Failed to open database: ${e.message}", e)
        }
    }

    @ReactMethod
    fun closeDatabase(promise: Promise) {
        try {
            database?.close()
            database = null
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("DATABASE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun isDatabaseOpen(promise: Promise) {
        promise.resolve(database != null && database!!.isOpen)
    }

    @ReactMethod
    fun executeQuery(query: String, parameters: ReadableMap?, promise: Promise) {
        var cursor: Cursor? = null
        try {
            val db = openDatabase()

            // Convert parameters from ReadableMap to array in correct order
            val paramList = mutableListOf<String>()
            if (parameters != null) {
                // Sort by key to maintain order (param0, param1, param2...)
                val keys = parameters.toHashMap().keys.sorted()
                for (key in keys) {
                    when (parameters.getType(key)) {
                        ReadableType.String -> {
                            parameters.getString(key)?.let { paramList.add(it) }
                                        ?: paramList.add("")
                        }
                        ReadableType.Number -> {
                            paramList.add(parameters.getDouble(key).toString())
                        }
                        ReadableType.Boolean -> {
                            paramList.add(if (parameters.getBoolean(key)) "1" else "0")
                        }
                        ReadableType.Null -> {
                            paramList.add("") // SQLite treats empty string as NULL in some contexts
                        }
                        else -> {
                            paramList.add("")
                        }
                    }
                }
            }

            val params = if (paramList.isEmpty()) emptyArray() else paramList.toTypedArray()
            
            Log.d(TAG, "Executing query: $query with params: ${paramList.joinToString()}")

            if (query.trim().uppercase(Locale.ROOT).startsWith("SELECT")) {
                cursor = db.rawQuery(query, params)

                val rows = Arguments.createArray()
                while (cursor.moveToNext()) {
                    val row = Arguments.createMap()
                    for (i in 0 until cursor.columnCount) {
                        val columnName = cursor.getColumnName(i)
                        when (cursor.getType(i)) {
                            Cursor.FIELD_TYPE_STRING -> {
                                row.putString(columnName, cursor.getString(i))
                            }
                            Cursor.FIELD_TYPE_INTEGER -> {
                                // Use putInt for integers to match iOS behavior
                                row.putInt(columnName, cursor.getInt(i))
                            }
                            Cursor.FIELD_TYPE_FLOAT -> {
                                row.putDouble(columnName, cursor.getDouble(i))
                            }
                            Cursor.FIELD_TYPE_BLOB -> {
                                val blob = cursor.getBlob(i)
                                row.putString(columnName, android.util.Base64.encodeToString(blob, android.util.Base64.NO_WRAP))
                            }
                            Cursor.FIELD_TYPE_NULL -> {
                                row.putNull(columnName)
                            }
                        }
                    }
                    rows.pushMap(row)
                }

                val result = Arguments.createMap()
                result.putArray("rows", rows)
                result.putInt("rowsAffected", rows.size())
                result.putInt("insertId", -1)

                promise.resolve(result)
            } else {
                // For INSERT, UPDATE, DELETE
                db.execSQL(query, params)

                val result = Arguments.createMap()
                result.putArray("rows", Arguments.createArray())
                
                // Get number of affected rows
                val changesCursor = db.rawQuery("SELECT changes()", null)
                var rowsAffected = 0
                if (changesCursor.moveToFirst()) {
                    rowsAffected = changesCursor.getInt(0)
                }
                changesCursor.close()
                result.putInt("rowsAffected", rowsAffected)

                // Get last insert ID if it was an INSERT
                if (query.trim().uppercase(Locale.ROOT).startsWith("INSERT")) {
                    val insertIdCursor = db.rawQuery("SELECT last_insert_rowid()", null)
                    if (insertIdCursor.moveToFirst()) {
                        result.putInt("insertId", insertIdCursor.getInt(0))
                    } else {
                        result.putInt("insertId", -1)
                    }
                    insertIdCursor.close()
                } else {
                    result.putInt("insertId", -1)
                }

                promise.resolve(result)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Query execution failed", e)
            promise.reject("DATABASE_ERROR", e.message, e)
        } finally {
            cursor?.close()
        }
    }

    @ReactMethod
    fun executeRawQuery(query: String, promise: Promise) {
        try {
            val db = openDatabase()
            db.execSQL(query)

            val result = Arguments.createMap()
            
            // Get number of affected rows
            val changesCursor = db.rawQuery("SELECT changes()", null)
            var rowsAffected = 0
            if (changesCursor.moveToFirst()) {
                rowsAffected = changesCursor.getInt(0)
            }
            changesCursor.close()
            result.putInt("rowsAffected", rowsAffected)

            // Get last insert ID
            val insertIdCursor = db.rawQuery("SELECT last_insert_rowid()", null)
            if (insertIdCursor.moveToFirst()) {
                result.putInt("insertId", insertIdCursor.getInt(0))
            } else {
                result.putInt("insertId", -1)
            }
            insertIdCursor.close()

            promise.resolve(result)
        } catch (e: Exception) {
            Log.e(TAG, "Raw query execution failed", e)
            promise.reject("DATABASE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN built-in Event Emitter calls
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN built-in Event Emitter calls
    }
}