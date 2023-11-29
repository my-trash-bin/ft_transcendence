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
CREATE TABLE "PongSeasonLog" (
    "season" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "consecutiveWin" INTEGER NOT NULL,
    "maxConsecutiveWin" INTEGER NOT NULL,
    "maxConsecutiveLose" INTEGER NOT NULL,
    "win" INTEGER NOT NULL,
    "lose" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "winRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PongSeasonLog_pkey" PRIMARY KEY ("userId","season")
);

-- CreateTable
CREATE TABLE "PongLiveGame" (
    "id" UUID NOT NULL,
    "startedAt" TEXT NOT NULL,
    "isEnd" BOOLEAN NOT NULL,
    "player1Id" UUID NOT NULL,
    "player2Id" UUID NOT NULL,

    CONSTRAINT "PongLiveGame_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "PongSeasonLog_season_consecutiveWin_userId_idx" ON "PongSeasonLog"("season", "consecutiveWin", "userId");

-- CreateIndex
CREATE INDEX "PongSeasonLog_season_win_userId_idx" ON "PongSeasonLog"("season", "win", "userId");

-- CreateIndex
CREATE INDEX "PongSeasonLog_season_total_userId_idx" ON "PongSeasonLog"("season", "total", "userId");

-- CreateIndex
CREATE INDEX "PongSeasonLog_season_winRate_total_userId_idx" ON "PongSeasonLog"("season", "winRate", "total", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PongLiveGame_player1Id_key" ON "PongLiveGame"("player1Id");

-- CreateIndex
CREATE UNIQUE INDEX "PongLiveGame_player2Id_key" ON "PongLiveGame"("player2Id");

-- CreateIndex
CREATE INDEX "PongLiveGame_isEnd_startedAt_idx" ON "PongLiveGame"("isEnd", "startedAt");

-- CreateIndex
CREATE INDEX "PongLiveGame_startedAt_idx" ON "PongLiveGame"("startedAt");

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
ALTER TABLE "PongLiveGame" ADD CONSTRAINT "PongLiveGame_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PongLiveGame" ADD CONSTRAINT "PongLiveGame_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
