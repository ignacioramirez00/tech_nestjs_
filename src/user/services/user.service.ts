import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserRegisterDto } from '../dto/UserRegister.dto';
import { ErrorManager } from '../../utils/error.manager';
import { envs } from '../../config/envs';
import * as bycrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async registerUser(user: UserRegisterDto): Promise<UserEntity> {
    try {
      if (await this.findBy({ key: 'email', value: user.email })) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Email already exists',
        });
      }
      if (await this.findBy({ key: 'username', value: user.username })) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Username already exists',
        });
      }
      user.password = await bycrypt.hash(user.password, envs.hashSecret);
      return await this.userRepository.save(user);
    } catch (error) {
      throw ErrorManager.createSignetureError(error.message);
    }
  }

  public async findById(id: string): Promise<UserEntity> {
    try {
      const userFindId = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();
      if (!userFindId) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User not found with this id',
        });
      }
      return userFindId;
    } catch (error) {
      throw ErrorManager.createSignetureError(error.message);
    }
  }

  public async findUsers(): Promise<UserEntity[]> {
    try {
      const result: UserEntity[] = await this.userRepository.find();
      if (result.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Users already exists',
        });
      }
      return result;
    } catch (error) {
      throw ErrorManager.createSignetureError(error.message);
    }
  }

  public async findBy({
    key,
    value,
  }: {
    key: keyof UserRegisterDto;
    value: any;
  }) {
    try {
      const userFind = await this.userRepository
        .createQueryBuilder('user')
        .where(`user.${key} = :value`, { value })
        .addSelect('user.password')
        .getOne();

      return userFind;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
