export class UpdateProductWithImageCommand {
  constructor(
    public readonly id: bigint,
    public readonly name?: string,
    public readonly description?: string,
    public readonly price?: number,
    public readonly category?: string,
    public readonly brand?: string,
    public readonly stock?: number,
    public readonly isActive?: boolean,
    public readonly image?: Express.Multer.File,
  ) {}
}
