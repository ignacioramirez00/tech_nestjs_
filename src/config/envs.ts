import 'dotenv/config';

// aca se debe validar mediante un esquema de joi
import * as joi from 'joi';

interface Envars {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  HASH_SECRET: string;
  JWT_SECRET: string;
  JWT_EXPIRES: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    HASH_SECRET: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: Envars = value;

export const envs = {
  port: envVars.PORT,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUser: envVars.DB_USER,
  dbPassword: envVars.DB_PASSWORD,
  dbName: envVars.DB_NAME,
  hashSecret: envVars.HASH_SECRET,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpires: envVars.JWT_EXPIRES,
};
