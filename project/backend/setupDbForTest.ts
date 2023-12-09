import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { scrypt } from 'node:crypto';

dotenv.config();

type LowercaseAlphabet =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'z';
type HexUpperDigits =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E';

const hexUpperDigits = '0123456789ABCDE';

function useLetter(letter: LowercaseAlphabet) {
  // 여기에서 letter 변수는 소문자 알파벳만을 가질 수 있습니다.
}

function getOneHexUpperDigits(n: number): HexUpperDigits {
  return hexUpperDigits[n % hexUpperDigits.length] as HexUpperDigits;
}

function getSimpleUuid(digit: HexUpperDigits) {
  const DASH = '-';
  return (
    digit.repeat(8) +
    DASH +
    digit.repeat(4) +
    DASH +
    digit.repeat(4) +
    DASH +
    digit.repeat(4) +
    DASH +
    digit.repeat(12)
  );
}

function getSimpleId(digit: HexUpperDigits, repeat = 6) {
  return digit.repeat(repeat);
}

type NumberKey = string;
enum EnumAvartar {
  'Blue' = '/avatar/avatar-blue.svg',
  'Black' = '/avatar/avatar-black.svg',
  'Big' = '/avatar/avatar-big.svg',
  'Small' = '/avatar/avatar-small.svg',
}
const Avartars: EnumAvartar[] = [
  EnumAvartar.Blue,
  EnumAvartar.Black,
  EnumAvartar.Big,
  EnumAvartar.Small,
];
interface TestAuthUserDataType {
  type: 'FT';
  id: NumberKey; // 1 ~
  userId: string; // 00000000-0000-0000-0000-000000000000 ~
  metadataJson: { id: NumberKey };
  profileImageUrl: EnumAvartar;
  nickname: string; // aaaaaa ~
  mfaPasswordHash: string | null; // 우선 null
}

class TestAuthUser {
  type!: 'FT';
  id!: NumberKey; // IntraId, 1 ~
  userId!: string; // 00000000-0000-0000-0000-000000000000 ~
  metadataJson!: { id: NumberKey };
  profileImageUrl!: EnumAvartar;
  nickname!: string; // aaaaaa ~
  mfaPasswordHash!: string | null; // 우선 null

  constructor(n: number) {
    const digit = getOneHexUpperDigits(n % 16);
    this.type = 'FT';
    this.id = (n + 1).toString();
    this.userId = getSimpleUuid(digit);
    this.metadataJson = { id: this.id };
    this.profileImageUrl = Avartars[n % 4];
    this.nickname = `testUser${digit}`;
    this.mfaPasswordHash = null;
  }
}

export function getSimpleAuthUsers(n = 16) {
  const testAuthUsers = Array.from({ length: n }).map(
    (_, idx) => new TestAuthUser(idx),
  );
  return testAuthUsers;
}

enum ChannelMemberType {
  ADMINISTRATOR = 'ADMINISTRATOR',
  MEMBER = 'MEMBER',
  BANNED = 'BANNED',
}

function mfaPasswordHash(password: string): Promise<string> {
  const salt = process.env.PASSWORD_SALT;
  if (!salt) {
    throw new Error('PASSWORD_SALT ENV 있는 곳으로 가!');
  }
  return new Promise<string>((resolve, reject) => {
    scrypt(password, salt, 32, (err, buffer) => {
      if (err) reject(err);
      else resolve(buffer.toString());
    });
  });
}
const TEST_CHANNEL_PASSWORD = 'somePassword';

const testInfo = {
  numOfUser: 10,
  friendship: [
    [[0], [1, 2, 3, 4, 5, 6, 7, 8, 9], []], // 0은 1~9번과 친구
    [[1], [0, 2, 3, 4, 5, 6, 7, 8], [9]], // 1은 0~8번과 친구, 9번은 차단
    [[2], [0, 3, 4, 5, 6, 7, 8], [9]], // 2은 0~8번과 친구, 9번은 차단
    [[3], [0, 1, 2, 4, 5, 6, 7], [8, 9]], // 3은 0~7번과 친구, 8,9번은 차단
    [[8], [], [0, 1, 2, 3, 4, 5, 6, 7, 9]], // 8은 모두 차단
    [[9], [0], [1, 2, 3, 4, 5, 6, 7, 8]], // 9는 0과 친구, 나머지는 모두 차단
  ],
  channels: [
    {
      channelInfo: {
        channelId: getSimpleUuid(getOneHexUpperDigits(0)),
        ownerId: getSimpleUuid(getOneHexUpperDigits(0)), // 모두 0번 유저가 생성
        title: 'Public Channel',
        isPublic: true,
        password: undefined,
        maximumMemberCount: 10,
      },
      members: [
        [0, ChannelMemberType.ADMINISTRATOR],
        [1, ChannelMemberType.ADMINISTRATOR],
        [2, ChannelMemberType.ADMINISTRATOR],
        [3, ChannelMemberType.MEMBER],
        [4, ChannelMemberType.MEMBER],
        [5, ChannelMemberType.MEMBER],
        [6, ChannelMemberType.MEMBER],
        [7, ChannelMemberType.BANNED],
        [8, ChannelMemberType.MEMBER],
        [9, ChannelMemberType.MEMBER],
      ],
    },
    {
      channelInfo: {
        channelId: getSimpleUuid(getOneHexUpperDigits(1)),
        ownerId: getSimpleUuid(getOneHexUpperDigits(1)),
        title: 'Private Channel',
        isPublic: false,
        password: undefined,
        maximumMemberCount: 10,
      },
      members: [
        [0, ChannelMemberType.MEMBER],
        [1, ChannelMemberType.ADMINISTRATOR],
        [2, ChannelMemberType.MEMBER],
        [3, ChannelMemberType.MEMBER],
        [4, ChannelMemberType.MEMBER],
        [7, ChannelMemberType.BANNED],
      ],
    },
    {
      channelInfo: {
        channelId: getSimpleUuid(getOneHexUpperDigits(2)),
        ownerId: getSimpleUuid(getOneHexUpperDigits(9)),
        title: 'Protected Channel',
        isPublic: false,
        password: TEST_CHANNEL_PASSWORD,
        maximumMemberCount: 10,
      },
      members: [
        [0, ChannelMemberType.MEMBER],
        [1, ChannelMemberType.MEMBER],
        [7, ChannelMemberType.MEMBER],
        [8, ChannelMemberType.MEMBER],
        [9, ChannelMemberType.ADMINISTRATOR],
      ],
    },
  ],
};

const achievements = [
  {
    imageUrl: '/achivement/bell.png',
    title: '손님',
    description: '토토로퐁에 가입 완료!',
  },
  {
    imageUrl: '/achivement/party.png',
    title: '리더',
    description: '채널을 1번 이상 생성!',
  },
  {
    imageUrl: '/achivement/tree.png',
    title: '게임왕',
    description: '게임 1승 성공!',
  },
  {
    imageUrl: '/achivement/reindeer.png',
    title: '게임러버1',
    description: '게임 1회 이상 플레이!',
  },
  {
    imageUrl: '/achivement/santa.png',
    title: '게임러버2',
    description: '게임 5회 이상 플레이!',
  },
  {
    imageUrl: '/achivement/snowflake.png',
    title: '게임러버3',
    description: '게임 10회 이상 플레이!',
  },
  {
    imageUrl: '/achivement/snowman.png',
    title: '인싸1',
    description: '친구 1명 이상!',
  },
  {
    imageUrl: '/achivement/star.png',
    title: '인싸2',
    description: '친구 5명 이상!',
  },

  {
    imageUrl: '/achivement/wreath.png',
    title: '인싸3',
    description: '친구 10명 이상!',
  },
];

const prisma = new PrismaClient();

async function main() {
  const TEST_CHANNEL_HASHED_PASSWORD = await mfaPasswordHash(
    TEST_CHANNEL_PASSWORD,
  );

  // 0. 초기화
  await prisma.dMMessage.deleteMany();
  await prisma.dMChannelInfo.deleteMany();
  await prisma.dMChannelAssociation.deleteMany();

  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();

  await prisma.pongGameHistory.deleteMany();

  await prisma.channelMessage.deleteMany();
  await prisma.channelInvitation.deleteMany();
  await prisma.channelMember.deleteMany();
  await prisma.channel.deleteMany();

  await prisma.notification.deleteMany();

  await prisma.userFollow.deleteMany();
  await prisma.user.deleteMany();
  await prisma.auth.deleteMany();

  await prisma.pongGameHistory.deleteMany();

  const testAuthUsers = getSimpleAuthUsers(testInfo.numOfUser);

  await prisma.$transaction(async (prisma) => {
    // 0. 9개의 업정 생성
    await prisma.achievement.createMany({
      data: achievements.map((el, idx) => ({
        ...el,
        id: getSimpleUuid(getOneHexUpperDigits(idx)),
      })),
    });
    // 1. 10명의 유저 생성 && 생성 업적 부여
    await prisma.auth.createMany({
      data: testAuthUsers.map(({ type, id, metadataJson }) => ({
        type,
        id,
        metadataJson: JSON.stringify(metadataJson),
      })),
    });
    await prisma.user.createMany({
      data: testAuthUsers.map(({ userId, nickname, profileImageUrl }) => ({
        id: userId,
        nickname,
        profileImageUrl,
      })),
    });

    // 2. 적당한 관계 형성
    await prisma.userFollow.createMany({
      data: [
        ...testInfo.friendship.flatMap(([followerId, friendIds, blockIds]) => [
          ...friendIds.map((friendId) => ({
            followerId: getSimpleUuid(getOneHexUpperDigits(followerId[0])),
            followeeId: getSimpleUuid(getOneHexUpperDigits(friendId)),
            isBlock: false,
          })),
          ...blockIds.map((blockId) => ({
            followerId: getSimpleUuid(getOneHexUpperDigits(followerId[0])),
            followeeId: getSimpleUuid(getOneHexUpperDigits(blockId)),
            isBlock: true,
          })),
        ]),
      ],
    });

    // 3. 채널 생성
    await prisma.channel.createMany({
      data: testInfo.channels.map(({ channelInfo }, idx) => ({
        id: channelInfo.channelId,
        title: channelInfo.title,
        isPublic: channelInfo.isPublic,
        password: channelInfo.password
          ? TEST_CHANNEL_HASHED_PASSWORD
          : undefined,
        maximumMemberCount: channelInfo.maximumMemberCount,
        ownerId: channelInfo.ownerId,
      })),
    });

    // get inserted userId
    const userIds = await prisma.user.findMany({
      select: { id: true },
    });

    // 4. game history 생성 with userIds
    await prisma.pongGameHistory.createMany({
      data: [
        {
          player1Id: userIds[0].id,
          player2Id: userIds[1].id,
          player1Score: 10,
          player2Score: 5,
          isPlayer1win: true,
          createdAt: new Date(),
        },
        {
          player1Id: userIds[0].id,
          player2Id: userIds[2].id,
          player1Score: 10,
          player2Score: 5,
          isPlayer1win: true,
          createdAt: new Date(),
        },
        {
          player1Id: userIds[0].id,
          player2Id: userIds[3].id,
          player1Score: 10,
          player2Score: 5,
          isPlayer1win: true,
          createdAt: new Date(),
        },
        {
          player1Id: userIds[0].id,
          player2Id: userIds[4].id,
          player1Score: 10,
          player2Score: 5,
          isPlayer1win: true,
          createdAt: new Date(),
        },
        {
          player1Id: userIds[0].id,
          player2Id: userIds[5].id,
          player1Score: 10,
          player2Score: 5,
          isPlayer1win: true,
          createdAt: new Date(),
        },
        {
          player1Id: userIds[1].id,
          player2Id: userIds[3].id,
          player1Score: 10,
          player2Score: 5,
          isPlayer1win: true,
          createdAt: new Date(),
        },
        {
          player1Id: userIds[1].id,
          player2Id: userIds[3].id,
          player1Score: 10,
          player2Score: 5,
          isPlayer1win: true,
          createdAt: new Date(),
        },
        {
          player1Id: userIds[2].id,
          player2Id: userIds[3].id,
          player1Score: 10,
          player2Score: 5,
          isPlayer1win: true,
          createdAt: new Date(),
        },
      ],
    });

    await prisma.userAchievement.createMany({
      data: [
        ...Array.from({ length: 10 }).map((_, idx) => ({
          userId: getSimpleUuid(getOneHexUpperDigits(idx)),
          achievementId: getSimpleUuid(getOneHexUpperDigits(0)), // 손님
        })),
        ...[0, 1, 9].map((i) => ({
          userId: getSimpleUuid(getOneHexUpperDigits(i)),
          achievementId: getSimpleUuid(getOneHexUpperDigits(1)), // 리더
        })),
        {
          userId: getSimpleUuid(getOneHexUpperDigits(0)), // 0번 유저가 1위
          achievementId: getSimpleUuid(getOneHexUpperDigits(2)), // 게임왕
        },
        ...[0, 1, 2, 3, 4, 5].map((i) => ({
          userId: userIds[i].id,
          achievementId: getSimpleUuid(getOneHexUpperDigits(3)), // 게임러버1
        })),
        {
          userId: userIds[0].id,
          achievementId: getSimpleUuid(getOneHexUpperDigits(4)), // 게임러버2
        },
        ...[0, 1, 2, 3, 9].map((i) => ({
          userId: userIds[i].id,
          achievementId: getSimpleUuid(getOneHexUpperDigits(6)), // 인싸1
        })),
        ...[0, 1, 2, 3].map((i) => ({
          userId: userIds[i].id,
          achievementId: getSimpleUuid(getOneHexUpperDigits(7)), // 인싸2
        })),
      ],
    });

    await prisma.channelMember.createMany({
      data: testInfo.channels.flatMap(({ channelInfo, members }) =>
        members.map((memberInfo) => ({
          channelId: channelInfo.channelId,
          memberId: getSimpleUuid(
            getOneHexUpperDigits(memberInfo[0] as number),
          ),
          memberType: memberInfo[1] as ChannelMemberType,
        })),
      ),
    });

    // 방 인원수 업데이트
    await prisma.channel.update({
      where: { id: getSimpleUuid(getOneHexUpperDigits(0)) },
      data: {
        memberCount: testInfo.channels[0].members.filter(
          (member) => member[1] !== ChannelMemberType.BANNED,
        ).length,
      },
    });
    await prisma.channel.update({
      where: { id: getSimpleUuid(getOneHexUpperDigits(1)) },
      data: {
        memberCount: testInfo.channels[1].members.filter(
          (member) => member[1] !== ChannelMemberType.BANNED,
        ).length,
      },
    });
    await prisma.channel.update({
      where: { id: getSimpleUuid(getOneHexUpperDigits(2)) },
      data: {
        memberCount: testInfo.channels[2].members.filter(
          (member) => member[1] !== ChannelMemberType.BANNED,
        ).length,
      },
    });

    // 각 방의 메시지 생성
    await prisma.channelMessage.createMany({
      data: [
        ...[0, 1, 8, 9].flatMap((userIdx) =>
          [0, 1, 2, 3].map((msgIdx) => ({
            channelId: getSimpleUuid(getOneHexUpperDigits(0)), // 0번 채널
            memberId: getSimpleUuid(getOneHexUpperDigits(userIdx)),
            messageJson: `${userIdx}번 유저의 ${msgIdx + 1}번째 메시지 `,
          })),
        ),
        ...[0, 1, 2, 3, 4, 7].flatMap((userIdx) =>
          [0, 1, 2, 3].map((msgIdx) => ({
            channelId: getSimpleUuid(getOneHexUpperDigits(1)), // 1번 채널
            memberId: getSimpleUuid(getOneHexUpperDigits(userIdx)),
            messageJson: `${userIdx}번 유저의 ${msgIdx + 1}번째 메시지 `,
          })),
        ),
        ...[0, 1, 7, 8, 9].flatMap((userIdx) =>
          [0, 1, 2, 3].map((msgIdx) => ({
            channelId: getSimpleUuid(getOneHexUpperDigits(2)), // 2번 채널
            memberId: getSimpleUuid(getOneHexUpperDigits(userIdx)),
            messageJson: `${userIdx}번 유저의 ${msgIdx + 1}번째 메시지 `,
          })),
        ),
      ],
    });
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
