import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRegisterDto } from '../dto/UserRegister.dto';

describe('UserService', () => {
  let service: UserService;
  const userRepositoryMock = {
    findBy: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(Object),
    })),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('registerUser', () => {
    describe('Success cases', () => {
      it('should save a new user when email and username are unique', async () => {
        const mockUser: UserRegisterDto = {
          name: 'Test',
          lastname: 'User',
          email: 'test@example.com',
          username: 'testUser',
          password: 'hashedPassword',
        };
        userRepositoryMock.createQueryBuilder.mockImplementation(() => ({
          where: jest.fn().mockReturnThis(),
          orWhere: jest.fn().mockReturnThis(),
          addSelect: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
        }));
        userRepositoryMock.save.mockResolvedValue(mockUser);

        const result = await service.registerUser(mockUser);

        expect(result).toEqual(mockUser);

        expect(userRepositoryMock.save).toHaveBeenCalledWith(mockUser);
      });
    });

    describe('Error cases', () => {
      it('should throw an error if email or username already exists', async () => {
        const mockUser: UserRegisterDto = {
          name: 'Test',
          lastname: 'User',
          email: 'test@example.com',
          username: 'testUser',
          password: 'hashedPassword',
        };
        userRepositoryMock.createQueryBuilder.mockImplementation(() => ({
          where: jest.fn().mockReturnThis(),
          orWhere: jest.fn().mockReturnThis(),
          addSelect: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(mockUser),
        }));

        const result = await service.registerUser(mockUser);
        expect(result).toBe('Email already exists');
        expect(userRepositoryMock.save).not.toHaveBeenCalled();
      });
    });
  });
});
