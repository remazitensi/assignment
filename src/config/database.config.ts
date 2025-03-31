import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/points/entity/user.entity';
import { Product } from '../modules/points/entity/product.entity';
import { Review } from '../modules/points/entity/review.entity';
import { PointHistory } from '../modules/points/entity/pointHistory.entity';
import { UserPoint } from '../modules/points/entity/userpoint.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Product, Review, PointHistory, UserPoint],
  synchronize: false,
  logging: true,
});
