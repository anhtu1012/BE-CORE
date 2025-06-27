import { Request } from 'express';

export function extractHeader(
  request: Request,
  header: string,
): string | undefined {
  const headerValue = request.headers[header];
  return Array.isArray(headerValue) ? headerValue[0] : headerValue;
}
