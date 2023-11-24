import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
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
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw new InternalServerErrorException('알수 없는 에러');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Error: Foreign key constraint failed on the field',
        ); // 추가적인 정보를 meta에 안 담아준다는것 같기도.
      }
      if (error.code === 'P2002') {
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

  async findOne(id: UserId) {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: id.value },
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
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw new InternalServerErrorException('알수 없는 에러');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Error: Foreign key constraint failed on the field',
        ); // 추가적인 정보를 meta에 안 담아준다는것 같기도.
      }
      if (error.code === 'P2002') {
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
