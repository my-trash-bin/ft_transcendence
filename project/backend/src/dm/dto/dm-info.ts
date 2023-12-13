export class DmInfo {
  canSend!: boolean;
  channelId!: string;

  constructor(canSend: boolean, channelId: string) {
    this.canSend = canSend;
    this.channelId = channelId;
  }
}
