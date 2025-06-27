import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Result, Ok, Err } from 'oxide.ts';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../database/product.repository.port';
import { DeleteProductCommand } from './delete-product.command';
import { DeleteProductResponseDto } from './delete-product.response.dto';

@Injectable()
export class DeleteProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async handle(
    command: DeleteProductCommand,
  ): Promise<Result<DeleteProductResponseDto, Error>> {
    try {
      const productOption = await this.productRepository.findOneById(
        command.id,
      );

      if (productOption.isNone()) {
        return Err(
          new NotFoundException(`Product with ID ${command.id} not found`),
        );
      }

      const success = await this.productRepository.delete(
        productOption.unwrap(),
      );
      if (!success) {
        return Err(new Error(`Failed to delete product with ID ${command.id}`));
      }

      return Ok({ message: 'Product deleted successfully' });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
