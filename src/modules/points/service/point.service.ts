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

  /** 특정 상품에 작성된 삭제되지 않은 리뷰가 있는지 확인 */
  private async isFirstValidReview(productId: string): Promise<boolean> {
    const count = await this.reviewRepository.count({
      where: { productId, deletedAt: null },
    });
    return count === 0;
  }

  /** 해당 사용자가 상품에 대해 이미 리뷰를 작성했는지 확인 */
  private async hasUserAlreadyReviewed(userId: string, productId: string): Promise<boolean> {
    const existingReview = await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        productId,
        deletedAt: null,
      },
    });
    return !!existingReview;
  }

  /** 포인트 적립 */
  async addPoints(userId: string, reviewId: string, productId: string, content: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('유저를 찾을 수 없습니다.');

    // 유저가 이미 해당 상품에 리뷰를 작성했는지 확인
    if (await this.hasUserAlreadyReviewed(userId, productId)) {
      throw new Error('이미 해당 상품에 리뷰를 작성했습니다.');
    }

    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) throw new Error('리뷰를 찾을 수 없습니다.');

    let totalPoints = 0;

    // 내용 점수: 1자 이상 작성 시 1점
    if (content.trim().length > 0) {
      totalPoints += 1;
    }

    // 보너스 점수: 해당 상품에 삭제되지 않은 리뷰가 없다면 1점
    if (await this.isFirstValidReview(productId)) {
      totalPoints += 1;
    }

    // 포인트 이력 저장
    const pointHistory = this.pointHistoryRepository.create({
      user,
      review,
      points: totalPoints,
      type: PointHistoryType.EARN,
    });
    await this.pointHistoryRepository.save(pointHistory);

    // 유저 포인트 갱신
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

  /** 포인트 회수 */
  async removePoints(userId: string, reviewId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });

    if (!user || !review) {
      throw new Error('유저 또는 리뷰를 찾을 수 없습니다.');
    }

    // 해당 리뷰로 적립된 포인트 이력 조회
    const earnedHistory = await this.pointHistoryRepository.findOne({
      where: {
        user,
        review,
        type: PointHistoryType.EARN,
      },
    });

    if (!earnedHistory) return;

    const deductedPoints = earnedHistory.points;

    // 회수 이력 저장
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

  /** 유저 총 포인트 조회 */
  async getUserPoints(userId: string): Promise<number> {
    const userPoint = await this.userPointRepository.findOne({
      where: { user: { id: userId } },
    });
    return userPoint?.totalPoints ?? 0;
  }
}
