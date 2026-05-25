import { IsString } from 'class-validator';

export class ParseResourceAssignmentDto {
  @IsString()
  command!: string;
}
