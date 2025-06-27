import { IFilter, ISingleFilter } from '@chax-at/prisma-filter-common';

export interface IFilterOr<T = any> extends IFilter<T> {
  orFilter?: Array<ISingleFilter<T>>;
}
