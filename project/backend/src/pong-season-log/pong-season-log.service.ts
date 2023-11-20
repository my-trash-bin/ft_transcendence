import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import { CreatePongSeasonLogDto } from './dto/create-pong-season-log.dto';
import { UpdatePongSeasonLogDto } from './dto/update-pong-season-log.dto';

@Injectable()
export class PongSeasonLogService {
  constructor(private prisma: PrismaService) {}

  create(createPongSeasonLogDto: CreatePongSeasonLogDto) {
    return 'This action adds a new pongSeasonLog';
  }

  findAll() {
    return `This action returns all pongSeasonLog`;
  }

  async findOne(userId: UserId) {
    const DEFAULT_SEASON = 1;
    const prismaLog = await this.prisma.pongSeasonLog.findUnique({
      where: {
        userId_season: {
          userId: userId.value,
          season: DEFAULT_SEASON,
        },
      },
    });
    if (!prismaLog) {
      throw new Error('something');
    }
    return prismaLog;
  }

  update(id: number, updatePongSeasonLogDto: UpdatePongSeasonLogDto) {
    return `This action updates a #${id} pongSeasonLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} pongSeasonLog`;
  }
}
