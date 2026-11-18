import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

// MMKV does not store a value's type, so a value must be read with the getter
// matching how it was written. Reading a number key with getString (as the old
// generic getItem did first) is not guaranteed to return undefined.

export const setItem = (key: string, value: string | number | boolean) => {
  storage.set(key, value);
};

export const getStringItem = (key: string): string | undefined =>
  storage.getString(key);

export const getNumberItem = (key: string): number | undefined =>
  storage.getNumber(key);

export const getBooleanItem = (key: string): boolean | undefined =>
  storage.getBoolean(key);

export const removeItem = (key: string) => {
  storage.delete(key);
};

export const clearStorage = () => {
  storage.clearAll();
};
