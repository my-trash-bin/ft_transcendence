import { DMMessage } from '@prisma/client';

export class DmChannelMessageDto {
  channelId!: string;
  sentAt!: Date;
  messagePreview!: string;
  profileImage!: string;

  constructor(instance: DMMessage) {}
}
