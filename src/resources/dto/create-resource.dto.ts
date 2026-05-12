import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { RESOURCE_TYPES, type ResourceType } from '../resource.model';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(RESOURCE_TYPES)
  type: ResourceType;

  @IsString()
  @IsNotEmpty()
  location: string;
}
