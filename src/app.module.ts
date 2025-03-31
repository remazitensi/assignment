import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/points/entity/user.entity';
import { Product } from './modules/points/entity/product.entity';
import { Review } from './modules/points/entity/review.entity';
import { PointHistory } from './modules/points/entity/pointHistory.entity';
import { UserPoint } from './modules/points/entity/userpoint.entity';
import { PointController } from './modules/points/controller/point.controller';
import { PointService } from './modules/points/service/point.service';
import { RequestMiddleware } from './common/middleware/logger.middleware';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    TypeOrmModule.forFeature([User, Product, Review, PointHistory, UserPoint]),
  ],
  controllers: [AppController, PointController],
  providers: [AppService, PointService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}