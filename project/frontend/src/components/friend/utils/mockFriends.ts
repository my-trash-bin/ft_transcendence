import { UserFollowDto } from '@/api/api';

const mockFriends: UserFollowDto[] = [
  {
    isBlock: false,
    followOrBlockedAt: '2023-11-24T12:00:00Z',
    followee: {
      id: '1',
      nickname: 'Followee1',
      profileImageUrl: '/avatar/avatar-black.svg',
      joinedAt: '2022-01-01T10:00:00Z',
      isLeaved: false,
      statusMessage: 'Followee1 status',
    },
  },
  {
    isBlock: true,
    followOrBlockedAt: '2023-11-25T14:30:00Z',
    followee: {
      id: '2',
      nickname: 'Followee2',
      profileImageUrl: '/avatar/avatar-blue.svg',
      joinedAt: '2022-02-15T08:45:00Z',
      isLeaved: false,
      statusMessage: 'Followee2 status',
    },
  },
  {
    isBlock: true,
    followOrBlockedAt: '2023-11-25T14:30:00Z',
    followee: {
      id: '3',
      nickname: 'Followee3',
      profileImageUrl: '/avatar/avatar-big.svg',
      joinedAt: '2022-02-15T08:45:00Z',
      isLeaved: false,
      statusMessage: 'Followee3 status',
    },
  },
  {
    isBlock: true,
    followOrBlockedAt: '2023-11-25T14:30:00Z',
    followee: {
      id: '4',
      nickname: 'Followee4',
      profileImageUrl: '/avatar/avatar-small.svg',
      joinedAt: '2022-02-15T08:45:00Z',
      isLeaved: false,
      statusMessage: 'Followee4 status',
    },
  },
  {
    isBlock: true,
    followOrBlockedAt: '2023-11-25T14:30:00Z',
    followee: {
      id: '5',
      nickname: 'Followee5',
      profileImageUrl: '/avatar/avatar-blue.svg',
      joinedAt: '2022-02-15T08:45:00Z',
      isLeaved: false,
      statusMessage: 'Followee5 status',
    },
  },
  {
    isBlock: true,
    followOrBlockedAt: '2023-11-25T14:30:00Z',
    followee: {
      id: '6',
      nickname: 'Followee6',
      profileImageUrl: '/avatar/avatar-black.svg',
      joinedAt: '2022-02-15T08:65:00Z',
      isLeaved: false,
      statusMessage: 'Followee6 status',
    },
  },

  // Add more mock data as needed
];

export default mockFriends;
