import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: UserId) {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: id.value },
    });
    return prismaUser;
  }

  update(id: UserId, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async isUniqueNickname(nickname: string) {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        nickname,
      },
    });
    return prismaUser === null;
  }
}
