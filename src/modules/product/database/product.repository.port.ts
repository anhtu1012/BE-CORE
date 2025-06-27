import { RepositoryPort } from '@src/lib/ddd';
import { Product } from 'generated/prisma';
import { PrismaPaginatedQueryParams, Paginated } from '@src/lib/ddd';
import { IField } from '@src/lib/utils';
import { Option } from 'oxide.ts';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepositoryPort extends RepositoryPort<Product> {
  insert(entity: Product): Promise<Product>;
  insertMany(entities: Product[]): Promise<Product[]>;
  update(entity: Product): Promise<Product>;
  updateMany(entities: Product[]): Promise<Product[]>;
  findOneById(id: bigint): Promise<Option<Product>>;
  findAll<TWhereInput = any>(where?: TWhereInput): Promise<Product[]>;
  findAllPaginated<TWhereInput = any>(
    params: PrismaPaginatedQueryParams<TWhereInput>,
  ): Promise<Paginated<Product>>;
  findAllPaginatedWithQuickSearch(
    params?: PrismaPaginatedQueryParams<any> & {
      quickSearch?: {
        quickSearchString?: string | number;
        searchableFields?: IField[];
      };
    },
  ): Promise<Paginated<Product>>;
  delete(entity: Product): Promise<boolean>;
  deleteMany(where: Record<string, any>): Promise<boolean>;
  transaction<T>(handler: () => Promise<T>): Promise<T>;
}
