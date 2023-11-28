interface AchivementProps {
  key: number;
  imageURL: string;
  name: string;
  explanation: string;
  isMine: boolean;
}

export const mockData: AchivementProps[] = [
  {
    key: 1,
    imageURL: '/achivement/bell.png',
    name: '손님',
    explanation: '토토로퐁에 가입 완료!',
    isMine: true,
  },
  {
    key: 2,
    imageURL: '/achivement/party.png',
    name: '리더',
    explanation: '채널을 1번 이상 생성!',
    isMine: false,
  },
  {
    key: 3,
    imageURL: '/achivement/reindeer.png',
    name: '방랑자',
    explanation: '채널을 5번 이상 생성!',
    isMine: true,
  },
  {
    key: 4,
    imageURL: '/achivement/santa.png',
    name: '게임러버',
    explanation: '게임 5회 이상 플레이!',
    isMine: true,
  },
  {
    key: 5,
    imageURL: '/achivement/snowflake.png',
    name: '출석왕',
    explanation: '출석 5회 이상 성공!',
    isMine: false,
  },
  {
    key: 6,
    imageURL: '/achivement/snowman.png',
    name: '인싸',
    explanation: '친구 30명 이상!',
    isMine: false,
  },
  {
    key: 7,
    imageURL: '/achivement/star.png',
    name: '중꺾마',
    explanation: '2연패 후 3연승 성공!',
    isMine: false,
  },
  {
    key: 8,
    imageURL: '/achivement/tree.png',
    name: '게임왕',
    explanation: '랭킹 1위 성공!',
    isMine: true,
  },
  {
    key: 9,
    imageURL: '/achivement/wreath.png',
    name: '수다왕',
    explanation: '메시지 100번 이상 전송 성공!',
    isMine: true,
  },
];
