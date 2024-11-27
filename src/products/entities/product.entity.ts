import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../config/base.entity';
import { Product } from '../../interface/product.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('Product')
export class ProductEntity extends BaseEntity implements Product {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.products)
  user_create_product_fk: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  api_fudo_syncronized: boolean;

  @Column({ type: 'int', nullable: true })
  external_id: number;
}
