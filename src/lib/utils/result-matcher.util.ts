import { Result } from 'oxide.ts';

export function match<T, E, R>(
  result: Result<T, E>,
  handlers: {
    Ok: (value: T) => R;
    Err: (error: E) => R;
  },
): R {
  if (result.isOk()) {
    return handlers.Ok(result.unwrap());
  } else {
    return handlers.Err(result.unwrapErr());
  }
}
