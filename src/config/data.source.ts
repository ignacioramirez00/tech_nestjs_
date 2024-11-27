import { DataSource, DataSourceOptions } from 'typeorm';
import { envs } from './envs';

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: envs.dbHost,
  port: envs.dbPort,
  username: envs.dbUser,
  password: envs.dbPassword,
  database: envs.dbName,
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
};

export const AppDS = new DataSource(DataSourceConfig);
