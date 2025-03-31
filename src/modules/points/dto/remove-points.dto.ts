import { IsUUID } from 'class-validator';

export class RemovePointsDto {
  @IsUUID()
  userId: string;
}
