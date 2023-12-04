import { DMMessage } from '@prisma/client';

class DmChannelMessageDto {
  channelId!: string;
  sentAt!: Date;
  messagePreview!: string;
  profileImage!: string;

  constructor(instance: DMMessage) {}
}
