import { IsNotEmpty, IsString } from 'class-validator';

export class ProductsDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
