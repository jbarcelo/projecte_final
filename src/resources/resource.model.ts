import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const RESOURCE_TYPES = [
  'laptop',
  'room',
  'software',
  'vehicle',
] as const;
export const RESOURCE_STATUS = ['available', 'assigned'] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];
export type ResourceStatus = (typeof RESOURCE_STATUS)[number];

export interface Resource {
  id: number;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  location: string;
  assignedToUserId: number | null;
  createdAt: string;
}

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;
  @Column()
  type!: ResourceType;
  @Column()
  status!: ResourceStatus;
  @Column()
  location!: string;
  @Column()
  createdAt!: string;
}
