import { Controller, Post, Delete, Put, Get, Param, Body } from '@nestjs/common';
import { PointService } from 'src/modules/points/service/point.service';
import { AddPointsDto } from 'src/modules/points/dto/add-points.dto';
import { RemovePointsDto } from 'src/modules/points/dto/remove-points.dto';
import { UpdatePointsDto } from 'src/modules/points/dto/update-points.dto';

@Controller('points')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  /** 포인트 적립 API */
  @Post()
  async addPoints(@Body() addPointsDto: AddPointsDto): Promise<void> {
    return this.pointService.addPoints(
      addPointsDto.userId,
      addPointsDto.reviewId,
      addPointsDto.productId,
      addPointsDto.content,
    );
  }

  /** 포인트 삭제 API */
  @Delete(':reviewId')
  async removePoints(
    @Param('reviewId') reviewId: string,
    @Body() removePointsDto: RemovePointsDto,
  ): Promise<void> {
    return this.pointService.removePoints(removePointsDto.userId, reviewId);
  }

  /** 포인트 수정 API */
  @Put(':reviewId')
  async updatePoints(
    @Param('reviewId') reviewId: string,
    @Body() updatePointsDto: UpdatePointsDto,
  ): Promise<void> {
    // 기존 포인트 회수
    await this.pointService.removePoints(updatePointsDto.userId, reviewId);
  
    // 새로운 포인트 추가
    await this.pointService.addPoints(
      updatePointsDto.userId,
      reviewId,
      updatePointsDto.productId,
      updatePointsDto.content,
    );
  }

  /** 포인트 조회 API */
  @Get(':userId')
  async getUserPoints(@Param('userId') userId: string): Promise<number> {
    return this.pointService.getUserPoints(userId);
  }
}
