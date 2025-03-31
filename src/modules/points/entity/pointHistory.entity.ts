import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Review } from './review.entity';

export enum PointHistoryType {
  EARN = 'EARN',
  REVOKE = 'REVOKE',
}

@Entity()
export class PointHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.pointHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Review, (review) => review.pointHistories, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reviewId' })
  review?: Review;

  @Column({ type: 'enum', enum: PointHistoryType })
  type: PointHistoryType;

  @Column({ type: 'int' })
  points: number;

  @CreateDateColumn()
  createdAt: Date;
}
