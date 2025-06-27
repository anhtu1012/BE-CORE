export class CreateArrayProductCommand {
  constructor(
    public readonly products: Array<{
      name: string;
      price: number;
      category: string;
      brand: string;
      description?: string;
      stock?: number;
      isActive?: boolean;
      imageUrl?: string;
    }>,
  ) {}
}
