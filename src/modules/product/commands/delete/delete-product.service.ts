import { Injectable, NotFoundException, Inject } from '@nestjs/common';
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
  ): Promise<DeleteProductResponseDto> {
    const productOption = await this.productRepository.findOneById(command.id);

    if (productOption.isNone()) {
      throw new NotFoundException(`Product with ID ${command.id} not found`);
    }

    const success = await this.productRepository.delete(productOption.unwrap());
    if (!success) {
      throw new Error(`Failed to delete product with ID ${command.id}`);
    }

    return { message: 'Product deleted successfully' };
  }
}
