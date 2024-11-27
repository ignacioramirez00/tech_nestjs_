import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { DataSourceConfig } from './config/data.source';
import { UserModule } from './user/user.module';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const logger = new Logger('Database');
        logger.log('Conectando a la base de datos...');
        return { ...DataSourceConfig };
      },
    }),
    ProductsModule,
    AuthModule,
    UserModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
