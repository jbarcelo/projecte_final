import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.model';

export const RESOURCE_TYPES = [
  'laptop',
  'room',
  'software',
  'vehicle',
] as const;
export const RESOURCE_STATUS = ['available', 'assigned'] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];
export type ResourceStatus = (typeof RESOURCE_STATUS)[number];

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
  @Column({ nullable: true })
  assignedToUserId!: number | null;
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedToUserId' })
  assignedToUser?: User | null;
  @Column()
  createdAt!: string;
}
