import { PrismaService } from './../../../shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Product } from 'generated/prisma';
import { ProductRepositoryPort } from './product.repository.port';
import { Option, Some, None } from 'oxide.ts';
import { PrismaPaginatedQueryParams, Paginated } from '@src/lib/ddd';
import { IField, builderPrismaCondition } from '@src/lib/utils';

@Injectable()
export class ProductRepositoryPrisma implements ProductRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async insert(entity: Product): Promise<Product> {
    const { ...data } = entity;
    return await this.prisma.product.create({
      data,
    });
  }

  async insertMany(entities: Product[]): Promise<Product[]> {
    const data = entities.map(({ ...entity }) => entity);
    await this.prisma.product.createMany({
      data,
      skipDuplicates: true,
    });
    return entities;
  }

  async update(entity: Product): Promise<Product> {
    return await this.prisma.product.update({
      where: { id: entity.id },
      data: entity,
    });
  }

  async updateMany(entities: Product[]): Promise<Product[]> {
    const results = await Promise.all(
      entities.map((entity) =>
        this.prisma.product.update({
          where: { id: entity.id },
          data: entity,
        }),
      ),
    );
    return results;
  }

  async findOneById(id: bigint): Promise<Option<Product>> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? Some(product) : None;
  }

  async findAll<TWhereInput = any>(where?: TWhereInput): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: where as Prisma.ProductWhereInput,
    });
  }

  async findAllPaginated<TWhereInput = any>(
    params: PrismaPaginatedQueryParams<TWhereInput>,
  ): Promise<Paginated<Product>> {
    const [data, count] = await Promise.all([
      this.prisma.product.findMany({
        where: params.where as Prisma.ProductWhereInput,
        skip: params.offset,
        take: params.limit,
        orderBy: params.orderBy as Prisma.ProductOrderByWithRelationInput[],
      }),
      this.prisma.product.count({
        where: params.where as Prisma.ProductWhereInput,
      }),
    ]);

    return new Paginated({
      data,
      count,
      limit: params.limit,
      page: params.page,
    });
  }

  async findAllPaginatedWithQuickSearch(
    params?: PrismaPaginatedQueryParams<any> & {
      quickSearch?: {
        quickSearchString?: string | number;
        searchableFields?: IField[];
      };
    },
  ): Promise<Paginated<Product>> {
    let where: Prisma.ProductWhereInput =
      (params?.where as Prisma.ProductWhereInput) || {};

    if (
      params?.quickSearch?.quickSearchString &&
      params?.quickSearch?.searchableFields
    ) {
      const quickSearchConditions = params.quickSearch.searchableFields.map(
        (field) =>
          builderPrismaCondition<Prisma.ProductWhereInput>(
            field,
            params.quickSearch!.quickSearchString,
          ),
      );

      where = {
        ...where,
        OR: quickSearchConditions,
      };
    }

    const [data, count] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: params?.offset || 0,
        take: params?.limit,
        orderBy: params?.orderBy as Prisma.ProductOrderByWithRelationInput[],
      }),
      this.prisma.product.count({ where }),
    ]);

    return new Paginated({
      data,
      count,
      limit: params?.limit || data.length,
      page: params?.page || 1,
    });
  }

  async delete(entity: Product): Promise<boolean> {
    try {
      await this.prisma.product.delete({
        where: { id: entity.id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteMany(where: Record<string, any>): Promise<boolean> {
    try {
      await this.prisma.product.deleteMany({
        where: where as Prisma.ProductWhereInput,
      });
      return true;
    } catch {
      return false;
    }
  }

  async transaction<T>(handler: () => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(async () => {
      return await handler();
    });
  }
}
