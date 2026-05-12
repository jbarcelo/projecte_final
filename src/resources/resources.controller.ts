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
import type { Resource } from './resource.model';
import { ResourcesService } from './resources.service';

@Controller('Resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  findAll(@Query() query: FindResourcesQueryDto): Resource[] {
    return this.resourcesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Resource {
    return this.resourcesService.findOne(id);
  }

  @Post()
  create(@Body() createResourceDto: CreateResourceDto): Resource {
    return this.resourcesService.create(createResourceDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResourceDto: UpdateResourceDto,
  ): Resource {
    return this.resourcesService.update(id, updateResourceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Resource {
    return this.resourcesService.remove(id);
  }
}
