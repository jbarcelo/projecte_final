import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const USER_ROLES = ['admin', 'member'] as const;
export type UserRole = (typeof USER_ROLES)[number];

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;
  @Column()
  email!: string;
  @Column()
  role!: UserRole;
  @Column({ default: true })
  active!: boolean;
  @Column()
  createdAt!: string;
}
