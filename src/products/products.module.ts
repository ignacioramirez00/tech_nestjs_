import { Module } from '@nestjs/common';
import { ProductsController } from './controller/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './service/products.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/services/user.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), UserModule, HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService, UserService],
})
export class ProductsModule {}
