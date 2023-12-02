import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import {
  newServiceFailPrismaKnownResponse,
  newServiceFailUnhandledResponse,
  newServiceOkResponse,
  ServiceResponse,
} from '../common/ServiceResponse';
import {
  isRecordNotFoundError,
  IsRecordToUpdateNotFoundError,
  isUniqueConstraintError,
} from '../util/prismaError';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  private logger = new Logger('NotificaitonController');
  constructor(private prisma: PrismaService) {}

  async create(
    id: UserId,
    contentJson: string,
  ): Promise<ServiceResponse<NotificationDto>> {
    try {
      const noti = await this.prisma.notification.create({
        data: {
          userId: id.value,
          contentJson,
        },
      });
      return newServiceOkResponse(noti);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        return newServiceFailPrismaKnownResponse(error.code, 409);
      }
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailUnhandledResponse(500);
    }
  }

  async findManyAndUpdateRead(
    id: UserId,
  ): Promise<ServiceResponse<NotificationDto[]>> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const notis = await prisma.notification.findMany({
          where: {
            userId: id.value,
          },
        });
        await prisma.notification.updateMany({
          where: {
            userId: id.value,
            isRead: false,
          },
          data: {
            isRead: true,
          },
        });
        return notis;
      });
      return newServiceOkResponse(result);
    } catch (error) {
      this.logger.error(error);
      return newServiceFailUnhandledResponse(400);
    }
  }
}
