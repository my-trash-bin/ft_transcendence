interface AchivementProps {
  key: number;
  imageURL: string;
  name: string;
  explanation: string;
}

export const mockData: AchivementProps[] = [
  {
    key: 1,
    imageURL: '/avatar/avatar-black.svg',
    name: '출석왕',
    explanation: '이번달 5회 출석 달성!',
  },
  {
    key: 2,
    imageURL: '/avatar/avatar-black.svg',
    name: '게임왕',
    explanation: '이번주 5회 개임 달성!',
  },
  {
    key: 3,
    imageURL: '/avatar/avatar-black.svg',
    name: '짱친',
    explanation: '접속 5회 달성!',
  },
  {
    key: 4,
    imageURL: '/avatar/avatar-black.svg',
    name: 'Achievement 4',
    explanation: 'This is the first achievement.',
  },
  {
    key: 5,
    imageURL: '/avatar/avatar-black.svg',
    name: 'Achievement 5',
    explanation: 'This is the second achievement.',
  },
  {
    key: 6,
    imageURL: '/avatar/avatar-black.svg',
    name: 'Achievement 6',
    explanation: 'This is the third achievement.',
  },
];
