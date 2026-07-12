// GRDBManagerModule.kt
package com.forsa_quran.database

import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import java.io.File
import java.io.FileOutputStream

@ReactModule(name = GRDBManagerModule.NAME)
class GRDBManagerModule(reactContext: ReactApplicationContext) :
    NativeGRDBManagerSpec(reactContext) {

    companion object {
        const val NAME = "GRDBManager"
        const val DATABASE_NAME = "quran_arabic2.db"
    }

    private var database: SQLiteDatabase? = null

    override fun getName() = NAME

    private fun getDatabasePath(): String =
        reactApplicationContext.getDatabasePath(DATABASE_NAME).absolutePath

    private fun copyDatabaseIfNeeded() {
        val dbFile = File(getDatabasePath())
        if (dbFile.exists()) return
        dbFile.parentFile?.mkdirs()
        val input = reactApplicationContext.assets.open(DATABASE_NAME)
        val output = FileOutputStream(dbFile)
        val buffer = ByteArray(8192)
        var length: Int
        while (input.read(buffer).also { length = it } > 0) {
            output.write(buffer, 0, length)
        }
        output.flush(); output.close(); input.close()
    }

    private fun openDatabaseInternal(): SQLiteDatabase {
        if (database != null && database!!.isOpen) return database!!
        copyDatabaseIfNeeded()
        database = SQLiteDatabase.openDatabase(getDatabasePath(), null, SQLiteDatabase.OPEN_READWRITE)
        return database!!
    }

    override fun openDatabase(promise: Promise) {
        try {
            openDatabaseInternal()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("DATABASE_ERROR", e.message)
        }
    }

    override fun closeDatabase(promise: Promise) {
        database?.close()
        database = null
        promise.resolve(true)
    }

    override fun isDatabaseOpen(promise: Promise) {
        promise.resolve(database != null && database!!.isOpen)
    }

    override fun executeQuery(query: String, parameters: ReadableMap?, promise: Promise) {
        var cursor: Cursor? = null
        try {
            val db = openDatabaseInternal()
            val params = mutableListOf<String?>()

            parameters?.let {
                val map = it.toHashMap()
                for (i in 0 until map.size) {
                    val key = "param$i"
                    if (it.hasKey(key)) {
                        when (it.getType(key)) {
                            ReadableType.String -> params.add(it.getString(key))
                            ReadableType.Number -> params.add(it.getDouble(key).toString())
                            ReadableType.Boolean -> params.add(if (it.getBoolean(key)) "1" else "0")
                            else -> params.add("")
                        }
                    }
                }
            }

            cursor = db.rawQuery(query, params.toTypedArray())
            val rows = Arguments.createArray()

            while (cursor.moveToNext()) {
                val row = Arguments.createMap()
                for (i in 0 until cursor.columnCount) {
                    val column = cursor.getColumnName(i)
                    when (cursor.getType(i)) {
                        Cursor.FIELD_TYPE_STRING -> row.putString(column, cursor.getString(i))
                        Cursor.FIELD_TYPE_INTEGER -> row.putInt(column, cursor.getInt(i))
                        Cursor.FIELD_TYPE_FLOAT -> row.putDouble(column, cursor.getDouble(i))
                        Cursor.FIELD_TYPE_BLOB -> row.putString(
                            column, Base64.encodeToString(cursor.getBlob(i), Base64.DEFAULT)
                        )
                        Cursor.FIELD_TYPE_NULL -> row.putNull(column)
                    }
                }
                rows.pushMap(row)
            }

            val result = Arguments.createMap()
            result.putArray("rows", rows)
            result.putInt("rowsAffected", rows.size())
            result.putInt("insertId", -1)
            promise.resolve(result)

        } catch (e: Exception) {
            Log.e("GRDBManager", e.message ?: "")
            promise.reject("DATABASE_ERROR", e.message)
        } finally {
            cursor?.close()
        }
    }

    override fun executeRawQuery(query: String, promise: Promise) {
        try {
            val db = openDatabaseInternal()
            db.execSQL(query)
            val result = Arguments.createMap()
            result.putInt("rowsAffected", 1)
            result.putInt("insertId", -1)
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("DATABASE_ERROR", e.message)
        }
    }
}