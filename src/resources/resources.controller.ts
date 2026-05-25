import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { AssignResourceDto } from './dto/assign-resource.dto';
import type { Resource } from './resource.model';
import { ResourcesService } from './resources.service';

@Controller('Resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  findAll(@Query() query: FindResourcesQueryDto): Promise<Resource[]> {
    return this.resourcesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Resource> {
    return this.resourcesService.findOne(id);
  }

  @Post()
  create(@Body() createResourceDto: CreateResourceDto): Promise<Resource> {
    return this.resourcesService.create(createResourceDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    return this.resourcesService.update(id, updateResourceDto);
  }

  @Patch(':id/assign')
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignResourceDto: AssignResourceDto,
  ): Promise<Resource> {
    return this.resourcesService.assign(id, assignResourceDto);
  }

  @Patch(':id/release')
  release(@Param('id', ParseIntPipe) id: number): Promise<Resource> {
    return this.resourcesService.release(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Resource> {
    return this.resourcesService.remove(id);
  }
}
