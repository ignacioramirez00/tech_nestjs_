import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { ProductsDto } from '../dto/Products.dto';
import { ProductEntity } from '../entities/product.entity';
import { ResultProduct } from '../interface/result_product';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() product: ProductsDto,
    @Request() req,
  ): Promise<ProductEntity> {
    return await this.productsService.CreatedProduct(product, req.user.id);
  }

  @Get()
  async findProducts(): Promise<ProductEntity[]> {
    return await this.productsService.findProducts();
  }

  @Get('by-user')
  async findProductByUser(@Request() req): Promise<ResultProduct> {
    return await this.productsService.findProductByUser(req.user.id);
  }
}
