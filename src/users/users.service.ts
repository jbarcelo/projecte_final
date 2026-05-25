import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import 'dotenv/config';
import OpenAI from 'openai';
import { Repository } from 'typeorm';
import type { Resource } from '../resources/resource.model';
import { ResourcesService } from '../resources/resources.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { FindUsersQueryDto } from './dto/find-users-query.dto';
import type { ParseResourceAssignmentDto } from './dto/parse-resource-assignment.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';

type ResourceAssignmentIds = {
  userId: number;
  resourceId: number;
};

@Injectable()
export class UsersService {
  private client?: OpenAI;
  private readonly model = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini';

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly resourcesService: ResourcesService,
  ) {}

  findAll(query: FindUsersQueryDto): Promise<User[]> {
    const { active, role } = query;

    const where: Partial<User> = {};

    if (active != undefined) {
      where.active = active;
    }

    if (role != undefined) {
      where.role = role;
    }

    return this.usersRepository.find({ where });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      role: createUserDto.role,
      active: true,
      createdAt: new Date().toISOString(),
    });

    return this.usersRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const {
      name = user.name,
      email = user.email,
      role = user.role,
      active = user.active,
    } = updateUserDto;

    return this.usersRepository.save({ ...user, name, email, role, active });
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }

  async parseResourceAssignment(
    parseResourceAssignmentDto: ParseResourceAssignmentDto,
  ): Promise<Resource> {
    const response = await this.getClient().responses.create({
      model: this.model,
      input: [
        {
          role: 'system',
          content:
            'Extract resource assignment ids from the user command. Return only JSON with exactly this shape: {"userId":number, "resourceId":number}. If either id is missing, return {"error":"missing_fields"}.',
        },
        {
          role: 'user',
          content: parseResourceAssignmentDto.command,
        },
      ],
    });

    const parsedAssignment = this.parseAssignmentJson(response.output_text);

    if ('error' in parsedAssignment) {
      throw new BadRequestException('userId and resourceId are required');
    }

    return this.resourcesService.assign(parsedAssignment.resourceId, {
      userId: parsedAssignment.userId,
    });
  }

  private getClient(): OpenAI {
    if (!process.env.OPENAI_API_KEY) {
      throw new InternalServerErrorException(
        'OPENAI_API_KEY is not configured',
      );
    }

    this.client ??= new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    return this.client;
  }

  private parseAssignmentJson(
    outputText: string,
  ): ResourceAssignmentIds | { error: string } {
    const jsonMatch = outputText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new BadRequestException('OpenAI did not return valid JSON');
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      throw new BadRequestException('OpenAI did not return valid JSON');
    }
    if (typeof parsed === 'object' && parsed !== null && 'error' in parsed) {
      return { error: String(parsed.error) };
    }
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('userId' in parsed) ||
      !('resourceId' in parsed) ||
      typeof parsed.userId !== 'number' ||
      typeof parsed.resourceId !== 'number'
    ) {
      throw new BadRequestException(
        'OpenAI did not return userId and resourceId',
      );
    }
    return {
      userId: parsed.userId,
      resourceId: parsed.resourceId,
    };
  }
}
