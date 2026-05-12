import { IsIn, IsOptional } from 'class-validator';
import {
  RESOURCE_TYPES,
  type ResourceType,
  RESOURCE_STATUS,
  type ResourceStatus,
} from '../resource.model';

export class FindResourcesQueryDto {
  @IsOptional()
  @IsIn(RESOURCE_TYPES)
  type?: ResourceType;

  @IsOptional()
  @IsIn(RESOURCE_STATUS)
  status?: ResourceStatus;
}
