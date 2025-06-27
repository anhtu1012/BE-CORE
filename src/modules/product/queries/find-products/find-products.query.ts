import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Prisma } from 'generated/prisma';
import { PrismaPaginatedQueryWithQuickSearchBase } from '@src/lib/ddd';

export class FindProductsQuery extends PrismaPaginatedQueryWithQuickSearchBase<Prisma.ProductWhereInput> {
  constructor(
    props: GeneratedFindOptions<Prisma.ProductWhereInput> & {
      quickSearch?: string | number;
    },
  ) {
    super(props);
  }
}
