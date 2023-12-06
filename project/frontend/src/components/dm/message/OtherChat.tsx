'use client';

import Portal from '@/components/common/Portal';
import { ProfileModal } from '@/components/profile/ProfileModal';
import Image from 'next/image';
import { ReactNode, useState } from 'react';
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
  const [modalData, setModalData] = useState<ReactNode>('');

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Portal selector={'#modal-channel'}>
        <ProfileModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          targetId={targetId}
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
              src={profileImage}
              width={40}
              height={40}
              layout="responsive"
            />
          </button>
        ) : (
          <div className="w-[50px] h-[50px] mt-[5px]"></div>
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
