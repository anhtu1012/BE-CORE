import { Injectable } from '@nestjs/common';

interface CacheService {
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;
}

@Injectable()
export class GenerateCode {
  constructor(private readonly cacheService: CacheService) {}

  async generateCode(key: string, padStart: number): Promise<string> {
    if (!key || padStart < 1) {
      throw new Error(
        'Invalid parameters: key must be non-empty and padStart must be positive',
      );
    }

    try {
      const now = new Date();

      const date = `${now.getFullYear().toString().slice(2)}${String(
        now.getMonth() + 1,
      ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

      const keyDate = `${key}${date}`;
      const index = await this.cacheService.incr(keyDate);

      if (index === 1) {
        const endOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
        );

        const expireSeconds = Math.floor(
          (endOfDay.getTime() - now.getTime()) / 1000,
        );

        await this.cacheService.expire(keyDate, expireSeconds);
      }

      const formattedIndex = String(index).padStart(padStart, '0');
      return `${keyDate}${formattedIndex}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate code: ${message}`);
    }
  }
}
