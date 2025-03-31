import { Type } from 'class-transformer';
import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class AddPointsDto {
  @IsNotEmpty()
  @IsUUID() 
  @Type(() => String)
  userId: string;

  @IsNotEmpty()
  @IsUUID()  
  @Type(() => String)
  reviewId: string;

  @IsNotEmpty()
  @IsUUID() 
  @Type(() => String) 
  productId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
