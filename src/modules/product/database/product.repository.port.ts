import { RepositoryPort } from '@src/lib/ddd';
import { Product } from 'generated/prisma';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepositoryPort extends RepositoryPort<Product> {}
