import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './resource.model';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { User } from '../users/user.model';
@Module({
  imports: [TypeOrmModule.forFeature([Resource, User])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
