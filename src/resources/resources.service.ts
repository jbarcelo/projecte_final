import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateResourceDto } from './dto/create-resource.dto';
import type { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import type { UpdateResourceDto } from './dto/update-resource.dto';
import type { AssignResourceDto } from './dto/assign-resource.dto';
import { Resource } from './resource.model';
import { User } from '../users/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourcesRepository: Repository<Resource>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(query: FindResourcesQueryDto): Promise<Resource[]> {
    const { type, status } = query;

    const where: FindOptionsWhere<Resource> = {};

    if (type != undefined) {
      where.type = type;
    }

    if (status != undefined) {
      where.status = status;
    }

    return this.resourcesRepository.find({ where });
  }

  async findOne(id: number): Promise<Resource> {
    const resource = await this.resourcesRepository.findOneBy({ id });

    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    return resource;
  }

  create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const newResource = this.resourcesRepository.create({
      name: createResourceDto.name,
      type: createResourceDto.type,
      status: 'available',
      location: createResourceDto.location,
      createdAt: new Date().toISOString(),
    });

    return this.resourcesRepository.save(newResource);
  }

  async update(
    id: number,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    const resource = await this.findOne(id);

    const {
      name = resource.name,
      type = resource.type,
      status = resource.status,
      location = resource.status,
    } = updateResourceDto;

    return this.resourcesRepository.save({
      ...resource,
      name,
      type,
      status,
      location,
    });
  }

  async assign(
    id: number,
    assignResourceDto: AssignResourceDto,
  ): Promise<Resource> {
    const resource = await this.findOne(id);
    const user = await this.usersRepository.findOneBy({
      id: assignResourceDto.userId,
    });

    if (!user) {
      throw new NotFoundException(
        `User with id ${assignResourceDto.userId} not found`,
      );
    }

    if (resource.status === 'assigned') {
      throw new BadRequestException(
        `Resource with id ${id} is already assigned`,
      );
    }

    const assignedResource = this.resourcesRepository.create({
      ...resource,
      status: 'assigned',
      assignedToUserId: user.id,
    });

    return this.resourcesRepository.save(assignedResource);
  }

  async release(id: number): Promise<Resource> {
    const resource = await this.findOne(id);
    const releasedResource = this.resourcesRepository.create({
      ...resource,
      status: 'available',
      assignedToUserId: null,
    });

    return this.resourcesRepository.save(releasedResource);
  }

  async remove(id: number): Promise<Resource> {
    const resource = await this.findOne(id);

    return this.resourcesRepository.remove(resource);
  }
}
