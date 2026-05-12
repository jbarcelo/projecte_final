import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  RESOURCE_TYPES,
  type ResourceType,
  RESOURCE_STATUS,
  type ResourceStatus,
} from '../resource.model';

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsIn(RESOURCE_TYPES)
  type?: ResourceType;

  @IsOptional()
  @IsIn(RESOURCE_STATUS)
  status?: ResourceStatus;

  @IsOptional()
  @IsString()
  location?: string;
}
