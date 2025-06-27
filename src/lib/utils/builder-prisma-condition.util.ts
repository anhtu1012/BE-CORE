export type IField = { field: string; type: 'string' | 'number' | 'datetime' };

/**
 *
 * @param field
 * @param value
 * @returns
 */
export function builderPrismaCondition<T = any>(
  field: IField,
  value?: string | number | null,
): T {
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value === 'null')
  ) {
    return { [field.field]: null } as T;
  }

  if (field.type === 'number') {
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      return {} as T;
    }
    return { [field.field]: { equals: numericValue } } as T;
  }
  if (field.type === 'datetime') {
    const dateValue = new Date(value as string);

    if (isNaN(dateValue.getTime())) {
      return {} as T;
    }

    return { [field.field]: { equals: dateValue } } as T;
  }

  return {
    [field.field]: { contains: String(value), mode: 'insensitive' },
  } as T;
}
