import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/modules/points/entity/review.entity';
import { PointHistory, PointHistoryType } from 'src/modules/points/entity/pointHistory.entity';
import { UserPoint } from 'src/modules/points/entity/userpoint.entity';
import { User } from 'src/modules/points/entity/user.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(PointHistory)
    private readonly pointHistoryRepository: Repository<PointHistory>,
    @InjectRepository(UserPoint)
    private readonly userPointRepository: Repository<UserPoint>,
  ) {}

  /** 첫 리뷰 여부 확인 (삭제된 리뷰는 제외) */
private async isFirstReview(productId: string): Promise<boolean> {
  const existingReview = await this.reviewRepository.findOne({
    where: { productId, deletedAt: null }, // 삭제된 리뷰 제외
    relations: ['product'],
  });
  return !existingReview; // 첫 리뷰라면 true 반환
}

/** ✅ 포인트 적립 */
async addPoints(
  userId: string,
  reviewId: string,
  productId: string,
  content: string,
): Promise<void> {
  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error('유저를 찾을 수 없습니다.');
  }

  // 기본 점수 (예: content 길이에 따라 점수 결정)
  let totalPoints = content.length >= 10 ? 1 : 0; // 예시로 리뷰 내용이 10자 이상이면 1점 적립

  // 첫 리뷰인지 확인 후 보너스 점수 부여
  if (await this.isFirstReview(productId)) {
    totalPoints += 1; // 첫 리뷰일 때 보너스 1점 추가
  }

  // 포인트 이력 저장
  const pointHistory = this.pointHistoryRepository.create({
    user,
    review: { id: reviewId },
    points: totalPoints,
    type: PointHistoryType.EARN,
  });
  await this.pointHistoryRepository.save(pointHistory);

  // 유저 포인트 업데이트
  let userPoint = await this.userPointRepository.findOne({
    where: { user: { id: userId } },
  });

  if (userPoint) {
    userPoint.totalPoints += totalPoints;
  } else {
    userPoint = this.userPointRepository.create({ user, totalPoints });
  }
  await this.userPointRepository.save(userPoint);
}

/** ✅ 포인트 회수 */
async removePoints(userId: string, reviewId: string): Promise<void> {
  const user = await this.userRepository.findOne({ where: { id: userId } });
  const review = await this.reviewRepository.findOne({ where: { id: reviewId } });

  if (!user || !review) {
    throw new Error('유저 또는 리뷰를 찾을 수 없습니다.');
  }

  // 해당 리뷰의 포인트 이력 조회
  const pointHistory = await this.pointHistoryRepository.findOne({
    where: { review },
  });

  if (!pointHistory) return;

  const deductedPoints = pointHistory.points;

  // 포인트 이력에 회수 기록
  await this.pointHistoryRepository.save({
    user,
    review,
    points: -deductedPoints,
    type: PointHistoryType.REVOKE,
  });

  // 유저 포인트 차감
  const userPoint = await this.userPointRepository.findOne({
    where: { user: { id: userId } },
  });

  if (userPoint) {
    userPoint.totalPoints -= deductedPoints;
    await this.userPointRepository.save(userPoint);
  }
}

/** 현재 사용자의 총 포인트 조회 */
async getUserPoints(userId: string): Promise<number> {
  const userPoint = await this.userPointRepository.findOne({
    where: { user: { id: userId } },
  });
  return userPoint ? userPoint.totalPoints : 0;
}
}