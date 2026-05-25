import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ResourcesModule } from '../resources/resources.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ResourcesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
