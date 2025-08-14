import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function openDB() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabase({
      name: 'quran_arabic.db',
      createFromLocation: 1,
    });
  }
  return dbInstance;
}
