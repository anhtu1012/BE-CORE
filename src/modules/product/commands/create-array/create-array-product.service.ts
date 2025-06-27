import { Inject, Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { BulkOperationResponseProps } from '@src/lib/api/bulk-operation-response.base';
import { ErrorResponseType } from '@src/lib/api/error-response.type';
import { Product } from 'generated/prisma';
import { Err, Ok, Result } from 'oxide.ts';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from '../../database/product.repository.port';
import { CreateArrayProductCommand } from './create-array-product.command';

@Injectable()
export class CreateArrayProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async handle(
    command: CreateArrayProductCommand,
  ): Promise<Result<BulkOperationResponseProps<any>, Error>> {
    try {
      let createdSuccess = 0;
      const errors: ErrorResponseType<any>[] = [];

      const productsToCreate: Product[] = [];

      // Validate and prepare products
      for (let i = 0; i < command.products.length; i++) {
        const productData = command.products[i];
        try {
          const product = {
            name: productData.name,
            description: productData.description ?? null,
            price: new Decimal(productData.price),
            category: productData.category,
            brand: productData.brand,
            stock: productData.stock ?? 0,
            isActive: productData.isActive ?? true,
            imageUrl: productData.imageUrl ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Product;

          productsToCreate.push(product);
        } catch (error) {
          errors.push({
            index: i,
            data: productData,
            error:
              typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof (error as { message?: unknown }).message === 'string'
                ? (error as { message: string }).message
                : 'Validation failed',
          });
        }
      }

      // Bulk insert valid products
      if (productsToCreate.length > 0) {
        try {
          await this.productRepository.insertMany(productsToCreate);
          createdSuccess = productsToCreate.length;
        } catch {
          // If bulk insert fails, try individual inserts
          for (let i = 0; i < productsToCreate.length; i++) {
            try {
              await this.productRepository.insert(productsToCreate[i]);
              createdSuccess++;
            } catch (individualError) {
              errors.push({
                index: i,
                data: command.products[i],
                error:
                  typeof individualError === 'object' &&
                  individualError !== null &&
                  'message' in individualError &&
                  typeof (individualError as { message?: unknown }).message ===
                    'string'
                    ? (individualError as { message: string }).message
                    : 'Insert failed',
              });
            }
          }
        }
      }

      const result: BulkOperationResponseProps<any> = {
        createdSuccess,
        updatedSuccess: 0,
        errorCount: errors.length,
        errors: errors.length > 0 ? errors : null,
      };

      return Ok(result);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
