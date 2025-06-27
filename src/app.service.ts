import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCacheKey(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async getCacheKey(key: string): Promise<string> {
    const value = await this.cacheManager.get<string>(key);
    if (typeof value === 'undefined' || value === null) {
      throw new Error(`Cache key "${key}" not found`);
    }
    return value;
  }

  async deleteCacheKey(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // The resetCache method is removed because 'reset' does not exist on type 'Cache'.
  // If you need to clear all cache, you may need to use a specific cache store's API or implement a workaround.

  // This method assumes the underlying store supports 'keys()' (e.g., Redis store).
  async cacheStore(): Promise<string[]> {
    type CacheStoreWithKeys = {
      keys: () => Promise<string[]>;
    };
    const store = (this.cacheManager as { store?: CacheStoreWithKeys }).store;
    if (store && typeof store.keys === 'function') {
      return await store.keys();
    }
    throw new Error('The current cache store does not support listing keys.');
  }
}
