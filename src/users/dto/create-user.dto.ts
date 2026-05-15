import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { USER_ROLES, type UserRole } from '../user.model';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsIn(USER_ROLES)
  role!: UserRole;
}
