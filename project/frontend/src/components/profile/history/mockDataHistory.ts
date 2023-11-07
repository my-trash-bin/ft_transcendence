interface HistoryCardProps {
  key: number;
  user1Name: string;
  user2Name: string;
  user1Avatar: string;
  user2Avatar: string;
  user1Score: number;
  user2Score: number;
}

export const mockData: HistoryCardProps[] = [
  {
    key: 1,
    user1Name: 'Alice',
    user2Name: 'Bob',
    user1Avatar: '/avatar/avatar-black.svg',
    user2Avatar: '/avatar/avatar-small.svg',
    user1Score: 5,
    user2Score: 3,
  },
  {
    key: 2,
    user1Name: 'Eve',
    user2Name: 'Charlie',
    user1Avatar: '/avatar/avatar-black.svg',
    user2Avatar: '/avatar/avatar-small.svg',
    user1Score: 2,
    user2Score: 4,
  },
  {
    key: 3,
    user1Name: 'David',
    user2Name: 'Grace',
    user1Avatar: '/avatar/avatar-black.svg',
    user2Avatar: '/avatar/avatar-small.svg',
    user1Score: 1,
    user2Score: 0,
  },
  {
    key: 4,
    user1Name: 'Frank',
    user2Name: 'Helen',
    user1Avatar: '/avatar/avatar-black.svg',
    user2Avatar: '/avatar/avatar-small.svg',
    user1Score: 3,
    user2Score: 5,
  },
  {
    key: 5,
    user1Name: 'John',
    user2Name: 'Linda',
    user1Avatar: '/avatar/avatar-black.svg',
    user2Avatar: '/avatar/avatar-small.svg',
    user1Score: 4,
    user2Score: 2,
  },
];
