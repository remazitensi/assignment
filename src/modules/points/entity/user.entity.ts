import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Review } from './review.entity';
import { PointHistory } from './pointHistory.entity';
import { UserPoint } from './userpoint.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
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

  @OneToOne(() => UserPoint, (userPoint) => userPoint.user, { cascade: true })
  userPoint: UserPoint;
}
