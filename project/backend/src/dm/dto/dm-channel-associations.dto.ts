import { DMMessage } from '@prisma/client';

class DmChannelMessageDto {
  id!: string;
  sentAt!: Date;
  messageJson!: string;

  constructor(instance: DMMessage) {
    this.id = instance.id;
    this.sentAt = instance.sentAt;
    this.messageJson = instance.messageJson;
  }
}
