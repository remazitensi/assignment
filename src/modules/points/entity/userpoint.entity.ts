import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserPoint {
  @PrimaryColumn()
  userId: string; // User와 1:1 관계이므로 ID를 기본키로 설정

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ default: 0 })
  totalPoints: number; // 현재 총 포인트
}
