import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateBountyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsInt()
  @Min(1, { message: 'Reward must be at least 1 coin' })
  rewardCoins: number;
}
 
