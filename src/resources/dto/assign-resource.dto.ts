import { IsInt, Min } from 'class-validator';

export class AssignResourceDto {
  @IsInt()
  @Min(1)
  userId!: number;
}
