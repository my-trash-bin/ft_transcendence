import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import { isUniqueConstraintError } from '../util/isUniqueConstraintError';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async me(id: UserId) {
    const user = await this.prisma.user.findUnique({ where: { id: id.value } });
    return user ? new UserDto(user) : null;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const prismaUser = await this.prisma.user.create({
        data: {
          nickname: createUserDto.nickname,
          profileImageUrl: createUserDto.profileImageUrl,
        },
      });
      return new UserDto(prismaUser);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(
          `Error: Unique constraint failed on the (${
            error?.meta?.target ?? 'something'
          }) fields`,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<UserDto[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: {
        isLeaved: false,
      },
    });
    return prismaUsers.map((prismaUser) => new UserDto(prismaUser));
  }

  async findOne(targetId: UserId) {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: targetId.value },
    });
    return prismaUser === null ? null : new UserDto(prismaUser);
  }

  async findOneByNickname(nickname: string) {
    const prismaUser = await this.prisma.user.findUnique({
      where: { nickname },
    });
    return prismaUser === null ? null : new UserDto(prismaUser);
  }

  async update(id: UserId, updateUserDto: UpdateUserDto) {
    try {
      const prismaUser = await this.prisma.user.update({
        where: { id: id.value },
        data: {
          nickname: updateUserDto.nickname,
          profileImageUrl: updateUserDto.profileImageUrl,
        },
      });
      return new UserDto(prismaUser);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(
          `Error: Unique constraint failed on the (${
            error?.meta?.target ?? 'something'
          }) fields`,
        );
      }
      throw error;
    }
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
