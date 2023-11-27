export enum GateWayEvents {
  /* 메세지 전송 */
  ChannelMessage = 'channelMessage',
  Dm = 'dm',

  /* Dm 채널 생성 */
  CreateDmChannel = 'createDmChannel',

  /* (DM아닌) 채널 들어가기/나기기 */
  Join = 'join',
  Leave = 'leave',

  KickBanPromote = 'kickBanPromote',

  Events = 'events',
  Exception = 'exception', // Nest에서 WsException시 기본적으로 활용하는 이름

  Notification = 'noti',

  // 기타 이벤트들...
}
