import { IsUUID, IsString } from 'class-validator';

export class UpdatePointsDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  reviewId: string;

  @IsUUID()
  productId: string;

  @IsString()
  content: string;
}
