/**
 * Minimal LRU cache built on Map insertion order.
 * `get` refreshes recency; `set` evicts the least recently used entry
 * once `maxSize` is exceeded.
 */
export class LruCache<K, V> {
  private readonly map = new Map<K, V>();

  constructor(private readonly maxSize: number) {}

  get(key: K): V | undefined {
    const value = this.map.get(key);
    if (value !== undefined) {
      this.map.delete(key);
      this.map.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    this.map.delete(key);
    this.map.set(key, value);

    if (this.map.size > this.maxSize) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }
  }

  delete(key: K): void {
    this.map.delete(key);
  }
}
