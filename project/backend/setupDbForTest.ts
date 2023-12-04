import { PrismaClient } from '@prisma/client';

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
    this.nickname = getSimpleId(digit, 6);
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
        userId: 0,
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
        userId: 1,
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
        userId: 9,
        title: 'Protected Channel',
        isPublic: false,
        password: 'somePassword',
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
const prisma = new PrismaClient();

async function main() {
  // 0. 초기화
  await prisma.dMMessage.deleteMany();
  await prisma.dMChannelInfo.deleteMany();
  await prisma.dMChannelAssociation.deleteMany();

  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();

  await prisma.channelMessage.deleteMany();
  await prisma.channelInvitation.deleteMany();
  await prisma.channelMember.deleteMany();
  await prisma.channel.deleteMany();

  await prisma.notification.deleteMany();

  await prisma.userFollow.deleteMany();
  await prisma.user.deleteMany();
  await prisma.auth.deleteMany();

  const testAuthUsers = getSimpleAuthUsers(testInfo.numOfUser);

  await prisma.$transaction(async (prisma) => {
    // 1. 10명의 유저 생성
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
        password: channelInfo.password,
        maximumMemberCount: channelInfo.maximumMemberCount,
      })),
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
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
