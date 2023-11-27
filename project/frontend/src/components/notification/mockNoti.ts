const mockNotifications = [
  {
    id: 'notification-123',
    userId: '1',
    isRead: false,
    createdAt: new Date().toISOString(),
    contentJson:
      '{"type": "newFriend", "sourceId": "123", "sourceName": "klew"}',
  },
  {
    id: 'notification-456',
    userId: '2',
    isRead: false,
    createdAt: new Date().toISOString(),
    contentJson:
      '{"type": "newMessageDm", "sourceId": "123", "sourceName": "klew"}',
  },
  {
    id: 'notification-789',
    userId: '3',
    isRead: false,
    createdAt: new Date().toISOString(),
    contentJson:
      '{"type": "newMessageChannel", "sourceId": "123", "sourceName": "klew"}',
  },
  {
    id: 'notification-987',
    userId: '4',
    isRead: false,
    createdAt: new Date().toISOString(),
    contentJson:
      '{"type": "gameRequest", "sourceId": "123", "sourceName": "klew"}',
  },
  {
    id: 'notification-6543',
    userId: '5',
    isRead: false,
    createdAt: new Date().toISOString(),
    contentJson:
      '{"type": "newFriend", "sourceId": "123", "sourceName": "klew"}',
  },
];

export default mockNotifications;
