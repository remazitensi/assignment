import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Review } from './review.entity';
import { PointHistory } from './pointHistory.entity';
import { UserPoint } from './userpoint.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 유저가 작성한 리뷰들
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  // 포인트 변동 이력 (1:N)
  @OneToMany(() => PointHistory, (pointHistory) => pointHistory.user)
  pointHistories: PointHistory[];

  // 현재 총 포인트 (1:1)
  @OneToOne(() => UserPoint, (userPoint) => userPoint.user)
  @JoinColumn()
  userPoint: UserPoint;
}
