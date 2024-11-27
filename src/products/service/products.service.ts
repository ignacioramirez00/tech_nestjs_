import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProductEntity } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsDto } from '../dto/Products.dto';
import { ErrorManager } from '../../utils/error.manager';
import { UserService } from '../../user/services/user.service';
import { ResultProduct } from '../interface/result_product';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
@Injectable()
export class ProductsService implements OnModuleInit {
  private logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    this.logger.verbose('initiating synchronization');
    await this.synchronizeProducts();
  }

  private async synchronizeProducts() {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post('https://23f0013223494503b54c61e8bee1190c.api.mockbin.io/')
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Error when calling the api: ${error.message}`);
              throw new Error('Error when calling the api');
            }),
          ),
      );
      for (const product of data.data) {
        const existingProduct = await this.existsProductByNameSyncronized(
          product.id,
        );
        if (existingProduct === true) {
          throw new ErrorManager({
            type: 'CONFLICT',
            message: 'Products already exists',
          });
        } else {
          await this.productRepository.save({
            id: product.id,
            name: product.name,
            user_create_product_fk: null,
            api_fudo_syncronized: true,
            external_id: product.id,
          });
        }
      }
      this.logger.verbose(`Products synchronized successfully`);
    } catch (error) {
      this.logger.warn(`Error during synchronization: ${error.message}`);
    }
  }

  public async CreatedProduct(
    product: ProductsDto,
    userId: string,
  ): Promise<ProductEntity> {
    try {
      const newProduct = this.productRepository.create({
        ...product,
        user_create_product_fk: userId,
      });
      return await this.productRepository.save(newProduct);
    } catch (error) {
      throw new ErrorManager.createSignetureError(error.message);
    }
  }

  public async findProducts(): Promise<ProductEntity[]> {
    try {
      const result: ProductEntity[] = await this.productRepository
        .createQueryBuilder('product')
        .select(['product.id', 'product.name']) // Selecciona únicamente las columnas necesarias
        .getMany();

      if (result.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Products not found',
        });
      }
      return result;
    } catch (error) {
      throw ErrorManager.createSignetureError(error.message);
    }
  }

  public async findProductByUser(id: string): Promise<ResultProduct> {
    try {
      const user = await this.userService.findById(id);
      const result: ProductEntity[] = await this.productRepository
        .createQueryBuilder('product')
        .select(['product.id', 'product.name'])
        .where('product.userCreateProductFkId = :userCreateProductFkId', {
          userCreateProductFkId: id,
        })
        .getMany();

      const formattedResult: ResultProduct = {
        user: {
          username: user.username,
          name: user.name,
          lastname: user.lastname,
        },
        products: result.map((product) => ({
          id: product.id,
          name: product.name,
        })),
      };

      return formattedResult;
    } catch (error) {}
  }

  public async existsProductByNameSyncronized(id: number): Promise<boolean> {
    try {
      const product = await this.productRepository.findOne({
        where: { external_id: id, api_fudo_syncronized: true },
      });
      return product !== null;
    } catch (error) {
      console.error('Error checking if product exists:', error.message);
      throw new Error('Failed to check product existence');
    }
  }
}
