import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { PointHistory } from './pointHistory.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // userId 직접 참조 가능하도록 설정
  user: User;

  @Column({ type: 'uuid' })
  userId: string; // userId를 명시적으로 추가

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' }) // productId 직접 참조 가능하도록 설정
  product: Product;

  @Column({ type: 'uuid' })
  productId: string; // productId를 명시적으로 추가

  @OneToMany(() => PointHistory, (pointHistory) => pointHistory.review)
  pointHistories: PointHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @UpdateDateColumn()
  deletedAt: Date;
}
