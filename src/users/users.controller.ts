import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  Post,
  Patch,
  SetMetadata,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';
import { UserAttrs } from './user.attrs';
import { UpdateUserDto } from './user.update.dto';
import { CreateUserDto } from './user.create.dto';
import { Privilege } from '../auth/privilege';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @SetMetadata('requiredPrivileges', [Privilege.ReadUsers])
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserAttrs> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @SetMetadata('requiredPrivileges', [Privilege.WriteUsers])
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserAttrs> {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @SetMetadata('requiredPrivileges', [Privilege.WriteUsers])
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserAttrs> {
    return this.usersService.create(createUserDto);
  }
}
