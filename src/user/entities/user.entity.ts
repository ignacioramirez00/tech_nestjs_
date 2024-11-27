import { BaseEntity } from '../../config/base.entity';
import { User } from '../../interface/user.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  lastname: string;

  @Column({ unique: true, type: 'varchar', length: 30, nullable: false })
  username: string;

  @Column({ unique: true, type: 'varchar', length: 30, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  password: string;

  @OneToMany(() => ProductEntity, (product) => product.user_create_product_fk)
  products: ProductEntity[];
}
