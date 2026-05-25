import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateUserDto } from './dto/create-user.dto';
import type { FindUsersQueryDto } from './dto/find-users-query.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
}
