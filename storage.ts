import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const setItem = (key: string, value: string | number | boolean) => {
  storage.set(key, value);
};

export const getItem = (key: string): string | number | boolean | null => {
  if (!storage.contains(key)) {
    return null;
  }

  const stringValue = storage.getString(key);
  if (stringValue !== undefined) {
    return stringValue;
  }

  const numberValue = storage.getNumber(key);
  if (numberValue !== undefined) {
    return numberValue;
  }

  const booleanValue = storage.getBoolean(key);
  if (booleanValue !== undefined) {
    return booleanValue;
  }

  return null;
};

export const removeItem = (key: string) => {
  storage.delete(key);
};

export const clearStorage = () => {
  storage.clearAll();
};
