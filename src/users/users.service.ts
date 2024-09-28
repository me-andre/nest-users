import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRepo } from './user.repo';
import { UserAttrs } from './user.attrs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserRepo)
    private userModel: typeof UserRepo,
  ) {}

  async findOne(id: string): Promise<UserRepo> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: Partial<Omit<UserAttrs, 'id'>>,
  ): Promise<UserRepo> {
    const [updated] = await this.userModel.update(updateUserDto, {
      where: { id },
    });
    if (updated === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.findOne(id);
  }

  async create(createUserDto: Omit<UserAttrs, 'id'>): Promise<UserRepo> {
    return this.userModel.create(createUserDto);
  }
}
