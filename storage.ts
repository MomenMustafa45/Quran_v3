import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

// 🔹 Helpers for type-safe access
export const setItem = (key: string, value: string | number | boolean) => {
  console.log('storing the value');

  storage.set(key, value);
  const keys = storage.getAllKeys();
  console.log('🚀 ~ setItem ~ keys:', keys);
  console.log('stored the value');
};

export const getItem = (key: string) => {
  const value = storage.getString(key);
  if (value) return value;

  const numValue = storage.getNumber(key);
  console.log('🚀 ~ getItem ~ value:', value);
  if (numValue) return numValue;

  const boolValue = storage.getBoolean(key);
  if (boolValue !== undefined) return boolValue;

  return null;
};

export const removeItem = (key: string) => {
  storage.delete(key);
};

export const clearStorage = () => {
  storage.clearAll();
};
