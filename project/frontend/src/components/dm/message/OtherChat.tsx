'use client';

import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';
import Portal from '@/components/common/Portal';
import FriendInvite from '@/components/game/FriendInvite';
import { ProfileModal } from '@/components/profile/ProfileModal';
import Image from 'next/image';
import { useState } from 'react';
import { formatAMPM } from '../utils/FromatAmPm';

export function OtherChat({
  message,
  time,
  profileImage,
  isFirst,
  targetId,
  targetNickname,
}: Readonly<{
  message: string;
  time: Date;
  profileImage: string;
  isFirst: boolean;
  targetId: string;
  targetNickname: string;
}>) {
  const timeAMPM = formatAMPM(time);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [gameMode, setGameMode] = useState<'normal' | 'item'>('normal');

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleInviteClose = () => {
    setIsInviteOpen(false);
  };
  const handleInviteOpen = () => {
    setIsInviteOpen(true);
  };
  return (
    <>
      <Portal selector={'#backdrop-root'}>
        <ProfileModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          targetId={targetId}
          openInvite={handleInviteOpen}
          setGameMode={setGameMode}
        />
        <FriendInvite
          isOpen={isInviteOpen}
          onClose={handleInviteClose}
          mode={gameMode}
        />
      </Portal>
      <div className="flex flex-row pl-[3%] mb-[1.5%] items-center">
        {isFirst === true ? (
          <button
            className="w-[50px] h-[50px] mb-[10px]"
            onClick={handleModalOpen}
          >
            <Image
              alt="profile"
              src={avatarToUrl(profileImage)}
              width={40}
              height={40}
            />
          </button>
        ) : (
          <div className="w-[50px] h-[50px] mt-[5px]" />
        )}
        <div className="flex flex-col w-[80%] pl-[2%]">
          {isFirst === true ? (
            <p className="text-[15px] mb-[3px] mt-[3px] text-slate-700">
              {targetNickname}
            </p>
          ) : (
            ''
          )}
          <p
            className={`p-[2%] text-center text-white inline-block max-w-[35%] rounded-[20px]
                break-words bg-chat-color1 self-start min-w-[10%]`}
          >
            {message}
          </p>
          <p className="pl-[1%] text-[11px] self-start">{timeAMPM}</p>
        </div>
      </div>
    </>
  );
}
