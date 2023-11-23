import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import { ChannelDto } from './dto/channel-dto';
import { ChannelRelationDto } from './dto/channel-relation-dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelType } from './enums/channel-type.enum';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const prismaChannels = await this.prisma.channel.findMany();
    return prismaChannels.map((prismaChannel) => new ChannelDto(prismaChannel));
  }

  async findByUser(id: UserId) {
    const prismaChannelRelations = await this.prisma.channelMember.findMany({
      where: { channelId: id.value },
      select: {
        memberType: true,
        mutedUntil: true,
        channel: true,
      },
    });
    return prismaChannelRelations.map((el) => new ChannelRelationDto(el));
  }

  async create(
    id: UserId,
    { type, title, password, capacity }: CreateChannelDto,
  ) {
    const prismaChannel = await this.prisma.channel.create({
      data: {
        title,
        isPublic: type === ChannelType.Public,
        password,
        maximumMemberCount: capacity,
        ownerId: id.value,
      },
    });
    return new ChannelDto(prismaChannel);
  }
}
