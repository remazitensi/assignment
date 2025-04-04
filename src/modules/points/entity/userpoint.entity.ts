import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_points')
export class UserPoint {
  @PrimaryColumn('uuid')
  userId: string;

  @OneToOne(() => User, (user) => user.userPoint, { onDelete: 'CASCADE' })
  @JoinColumn() 
  user: User;

  @Column({ default: 0 })
  totalPoints: number;
}
