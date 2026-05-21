import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateResourceDto } from './dto/create-resource.dto';
import type { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import type { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './resource.model';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourcesRepository: Repository<Resource>,
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

  async remove(id: number): Promise<Resource> {
    const resource = await this.findOne(id);

    return this.resourcesRepository.remove(resource);
  }
}
