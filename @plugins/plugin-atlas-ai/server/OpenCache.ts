import { hash64 } from "./helperFunctions";

type CachedData<T> = {
  timestamp: number;
  value: T | null;
};

class OpenCache<T> {
  static _instance: OpenCache<any> | null = null; // Singleton instance

  cache: Map<string, CachedData<T>>;

  constructor() {
    if (OpenCache._instance) {
      return OpenCache._instance;
    }
    OpenCache._instance = this;
    this.cache = new Map();
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  has(key) {
    return this.cache.has(key);
  }

  generateHashKey(str) {
    return hash64(str);
  }

  async getOrSet(key: string, value) {
    const cachedValue = await this.get(key);
    if (cachedValue) {
      return cachedValue;
    }

    await this.set(key, value);
    return value;
  }
}

const _OpenCache = new OpenCache();

export default _OpenCache;
