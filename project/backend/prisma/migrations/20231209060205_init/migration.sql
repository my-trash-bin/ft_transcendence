-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('FT');

-- CreateEnum
CREATE TYPE "ChannelMemberType" AS ENUM ('ADMINISTRATOR', 'MEMBER', 'BANNED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "mfaPasswordHash" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isLeaved" BOOLEAN NOT NULL DEFAULT false,
    "leavedAt" TIMESTAMP(3),
    "nickname" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "statusMessage" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "type" "AuthType" NOT NULL,
    "id" TEXT NOT NULL,
    "metadataJson" TEXT NOT NULL,
    "userId" UUID,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("type","id")
);

-- CreateTable
CREATE TABLE "UserFollow" (
    "followerId" UUID NOT NULL,
    "followeeId" UUID NOT NULL,
    "isBlock" BOOLEAN NOT NULL,
    "followOrBlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("followerId","followeeId")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "userId" UUID NOT NULL,
    "achievementId" UUID NOT NULL,
    "achievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("userId","achievementId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentJson" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" UUID,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "maximumMemberCount" INTEGER NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelMember" (
    "channelId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "memberType" "ChannelMemberType" NOT NULL,
    "mutedUntil" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelMember_pkey" PRIMARY KEY ("channelId","memberId")
);

-- CreateTable
CREATE TABLE "ChannelMessage" (
    "id" UUID NOT NULL,
    "channelId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageJson" TEXT NOT NULL,

    CONSTRAINT "ChannelMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelInvitation" (
    "channelId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelInvitation_pkey" PRIMARY KEY ("channelId","memberId")
);

-- CreateTable
CREATE TABLE "DMChannelAssociation" (
    "id" UUID NOT NULL,
    "member1Id" UUID NOT NULL,
    "member2Id" UUID NOT NULL,

    CONSTRAINT "DMChannelAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DMChannelInfo" (
    "fromId" UUID NOT NULL,
    "toId" UUID NOT NULL,
    "channelId" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DMChannelInfo_pkey" PRIMARY KEY ("fromId","toId")
);

-- CreateTable
CREATE TABLE "DMMessage" (
    "id" UUID NOT NULL,
    "channelId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageJson" TEXT NOT NULL,

    CONSTRAINT "DMMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PongGameHistory" (
    "id" UUID NOT NULL,
    "player1Id" UUID NOT NULL,
    "player2Id" UUID NOT NULL,
    "player1Score" INTEGER NOT NULL,
    "player2Score" INTEGER NOT NULL,
    "isPlayer1win" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PongGameHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");

-- CreateIndex
CREATE INDEX "UserFollow_followerId_isBlock_followOrBlockedAt_idx" ON "UserFollow"("followerId", "isBlock", "followOrBlockedAt");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_achievedAt_idx" ON "UserAchievement"("userId", "achievedAt");

-- CreateIndex
CREATE INDEX "UserAchievement_achievementId_achievedAt_idx" ON "UserAchievement"("achievementId", "achievedAt");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Channel_isPublic_memberCount_idx" ON "Channel"("isPublic", "memberCount");

-- CreateIndex
CREATE INDEX "Channel_isPublic_title_idx" ON "Channel"("isPublic", "title");

-- CreateIndex
CREATE INDEX "Channel_isPublic_createdAt_idx" ON "Channel"("isPublic", "createdAt");

-- CreateIndex
CREATE INDEX "Channel_isPublic_lastActiveAt_idx" ON "Channel"("isPublic", "lastActiveAt");

-- CreateIndex
CREATE INDEX "ChannelMember_memberId_channelId_idx" ON "ChannelMember"("memberId", "channelId");

-- CreateIndex
CREATE INDEX "ChannelMessage_channelId_sentAt_idx" ON "ChannelMessage"("channelId", "sentAt");

-- CreateIndex
CREATE INDEX "ChannelInvitation_channelId_invitedAt_idx" ON "ChannelInvitation"("channelId", "invitedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DMChannelAssociation_member1Id_member2Id_key" ON "DMChannelAssociation"("member1Id", "member2Id");

-- CreateIndex
CREATE INDEX "DMChannelInfo_fromId_name_idx" ON "DMChannelInfo"("fromId", "name");

-- CreateIndex
CREATE INDEX "DMMessage_channelId_sentAt_idx" ON "DMMessage"("channelId", "sentAt");

-- CreateIndex
CREATE INDEX "PongGameHistory_createdAt_idx" ON "PongGameHistory"("createdAt");

-- CreateIndex
CREATE INDEX "PongGameHistory_player1Id_player2Id_idx" ON "PongGameHistory"("player1Id", "player2Id");

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMember" ADD CONSTRAINT "ChannelMember_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMember" ADD CONSTRAINT "ChannelMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMessage" ADD CONSTRAINT "ChannelMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMessage" ADD CONSTRAINT "ChannelMessage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelInvitation" ADD CONSTRAINT "ChannelInvitation_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelInvitation" ADD CONSTRAINT "ChannelInvitation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DMChannelAssociation" ADD CONSTRAINT "DMChannelAssociation_member1Id_fkey" FOREIGN KEY ("member1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DMChannelAssociation" ADD CONSTRAINT "DMChannelAssociation_member2Id_fkey" FOREIGN KEY ("member2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DMChannelInfo" ADD CONSTRAINT "DMChannelInfo_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DMChannelInfo" ADD CONSTRAINT "DMChannelInfo_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DMChannelInfo" ADD CONSTRAINT "DMChannelInfo_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "DMChannelAssociation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DMMessage" ADD CONSTRAINT "DMMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "DMChannelAssociation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DMMessage" ADD CONSTRAINT "DMMessage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PongGameHistory" ADD CONSTRAINT "PongGameHistory_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PongGameHistory" ADD CONSTRAINT "PongGameHistory_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;



-- Data

-- Achievement
INSERT INTO "Achievement" ("id", "title", "imageUrl", "description") VALUES
  ('00000000-0000-0000-0000-000000000000', '손님', '/achievement/bell.png', '토토로퐁에 가입 완료!'),
  ('11111111-1111-1111-1111-111111111111', '리더', '/achievement/party.png', '채널을 1번 이상 생성!'),
  ('22222222-2222-2222-2222-222222222222', '게임왕', '/achievement/tree.png', '게임 1승 성공!'),
  ('33333333-3333-3333-3333-333333333333', '게임러버1', '/achievement/reindeer.png', '게임 1회 이상 플레이!'),
  ('44444444-4444-4444-4444-444444444444', '게임러버2', '/achievement/santa.png', '게임 5회 이상 플레이!'),
  ('55555555-5555-5555-5555-555555555555', '게임러버3', '/achievement/snowflake.png', '게임 10회 이상 플레이!'),
  ('66666666-6666-6666-6666-666666666666', '인싸1', '/achievement/snowman.png', '친구 1명 이상!'),
  ('77777777-7777-7777-7777-777777777777', '인싸2', '/achievement/star.png', '친구 5명 이상!'),
  ('88888888-8888-8888-8888-888888888888', '인싸3', '/achievement/wreath.png', '친구 10명 이상!');
