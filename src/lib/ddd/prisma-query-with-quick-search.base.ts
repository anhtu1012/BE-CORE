// Ensure GeneratedFindOptions is correctly imported or defined.
// If it's missing or invalid, define it here or import the correct type.
import { GeneratedFindOptions, OrderBy } from '@chax-at/prisma-filter';
import { QueryBase } from './query.base';

/**
 * Base class for paginated queries using Prisma
 */
export abstract class PrismaPaginatedQueryWithQuickSearchBase<
  TWhereInput,
> extends QueryBase {
  readonly page: number;
  readonly limit: number;
  readonly offset: number;
  readonly orderBy: OrderBy<TWhereInput>;
  readonly where?: TWhereInput;
  readonly quickSearch?: string | number;

  constructor(
    props: GeneratedFindOptions<TWhereInput> & {
      quickSearch?: string | number;
    },
  ) {
    super();
    this.limit = props?.take || 10; // Default limit
    this.offset = props?.skip || 0; // Default offset
    this.page = this.limit > 0 ? Math.floor(this.offset / this.limit) + 1 : 1; // Calculate page from offset and limit
    this.orderBy = props?.orderBy ?? undefined; // Default orderBy is undefined
    this.where = props?.where || undefined; // Default where
    this.quickSearch = props?.quickSearch || undefined; // Default quickSearch
  }
}

export abstract class PrismaQueryWithQuickSearchBase<
  TWhereInput,
> extends QueryBase {
  readonly orderBy?: OrderBy<TWhereInput>;
  readonly where?: TWhereInput;
  readonly quickSearch?: string | number;

  constructor(
    props?: { where?: TWhereInput; orderBy?: OrderBy<TWhereInput> } & {
      quickSearch?: string | number;
    },
  ) {
    super();
    this.orderBy = props?.orderBy || undefined; // Default orderBy
    this.where = props?.where || undefined; // Default where
    this.quickSearch = props?.quickSearch || undefined; // Default quickSearch
  }
}
