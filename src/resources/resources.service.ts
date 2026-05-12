import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateResourceDto } from './dto/create-resource.dto';
import type { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import type { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './resource.model';

@Injectable()
export class ResourcesService {
  private resources: Resource[] = [
    {
      id: 1,
      name: 'Test Resource',
      type: 'laptop',
      status: 'available',
      location: 'cyberspace',
      createdAt: new Date().toISOString(),
      assignedToUserId: null,
    },
  ];

  findAll(query: FindResourcesQueryDto): Resource[] {
    const { type, status } = query;

    return this.resources.filter((resource) => {
      const matchesType = type === undefined || resource.type === type;
      const matchesStatus = status === undefined || resource.status === status;

      return matchesStatus && matchesType;
    });
  }

  findOne(id: number): Resource {
    const resource = this.resources.find(
      (currentResource) => currentResource.id === id,
    );

    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    return resource;
  }

  create(createResourceDto: CreateResourceDto): Resource {
    const newResource: Resource = {
      id: this.resources.length + 1,
      name: createResourceDto.name,
      type: createResourceDto.type,
      status: 'available',
      location: createResourceDto.location,
      assignedToUserId: null,
      createdAt: new Date().toISOString(),
    };

    this.resources.push(newResource);

    return newResource;
  }

  update(id: number, updateResourceDto: UpdateResourceDto): Resource {
    const resourceIndex = this.resources.findIndex(
      (resource) => resource.id === id,
    );

    if (resourceIndex === -1) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    const currentResource = this.resources[resourceIndex];
    const {
      name = currentResource.name,
      type = currentResource.type,
      status = currentResource.status,
      location = currentResource.status,
    } = updateResourceDto;

    this.resources[resourceIndex] = {
      ...currentResource,
      name,
      type,
      status,
      location,
    };

    return this.resources[resourceIndex];
  }

  remove(id: number): Resource {
    const resourceIndex = this.resources.findIndex(
      (resource) => resource.id === id,
    );

    if (resourceIndex === -1) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    const [deletedResource] = this.resources.splice(resourceIndex, 1);

    return deletedResource;
  }
}
