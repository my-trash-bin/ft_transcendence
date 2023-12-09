import React, { useState, useEffect } from 'react';
import { useCallback, useContext } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { useRouter } from 'next/navigation';
import { getGameSocket } from '../pong/gameSocket';
import { c } from '@/app/_internal/util/c';

interface NotiCardProps {
  isRead: boolean;
  content: string;
}

export const NotiCard: React.FC<NotiCardProps> = ({ content }) => {
  const sizeCSS = 'h-[60px] text-md';
  const colorCSS =
    'bg-white border-3 border-default rounded-md hover:bg-light-background';
  const alignCSS = 'flex items-center relative p-sm';
  let obj = JSON.parse(content);
  const [showToast, setShowToast] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [isInvited, setIsInvited] = useState(true);
  const { api } = useContext(ApiContext);
  const route = useRouter();
  const sourceId = obj.sourceId;
  const sourceName = obj.sourceName;
  const mode = obj.mode;
  const socket = getGameSocket();

  useEffect(() => {
    const handleCancelInvite = () => {
      setIsInvited(false);
      console.log('canceledInvite');
    };
    socket.on('canceledInvite', handleCancelInvite);
    return () => {
      socket.off('canceledInvite', handleCancelInvite);
    };
  }, [socket]);

  function handleMouseEnter() {
    setHovered(true);
  }

  function handleMouseLeave() {
    setHovered(false);
  }

  const requestFriend = useCallback(async () => {
    try {
      await api.userFollowControllerFollowUser({ targetUser: sourceId });
      console.log('Friend successfully');
    } catch (error) {
      console.error('Error friend:', error);
    }
  }, [api, sourceId]);

  let notificationContent;
  let hoverContent;
  let handlerFunction: any;

  switch (obj.type) {
    case 'newFriend':
      notificationContent = `가 당신을 친구로 추가했습니다.`;
      hoverContent = '나도 친구로 추가';
      handlerFunction = requestFriend;
      break;
    case 'newMessageDm':
      notificationContent = `으로부터 새로운 메세지가 도착했습니다.`;
      hoverContent = '메세지창으로 이동';
      handlerFunction = () => route.push(`/dm/${sourceName}`);
      break;
    case 'newMessageChannel':
      notificationContent = `으로부터 새로운 메세지가 도착했습니다.`;
      hoverContent = '메세지창으로 이동';
      handlerFunction = () => route.push(`/channel/${sourceId}`);
      break;
    case 'newGameInvitaion':
      notificationContent = `가 1대1 게임을 요청했습니다.`;
      hoverContent = '게임 참여하기';
      handlerFunction = () => {
        console.log('isInvited', isInvited);
        if (isInvited) {
          if (mode === 'normal') {
            socket.emit('acceptNormalMatch', sourceId);
            route.push('/pong');
          } else {
            socket.emit('acceptItemMatch', sourceId);
            route.push('/pong');
          }
        } else {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }
      break;
    default:
      return null; // Handle unknown type or return a default component
  }

  return (
    <>
    {showToast && (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white rounded-md z-50">
        초대가 취소되었습니다.
      </div>
    )}
    <div
      className={`group ${sizeCSS} ${colorCSS} ${alignCSS}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => handlerFunction()}
    >
      <div className={`relative ${isHovered ? 'hidden' : 'block'} `}>
        <strong>{sourceName}</strong>
        {notificationContent}
      </div>
      <div
        className={`absolute text-lg font-semibold  ${
          isHovered ? 'block' : 'hidden'
        } bg-light-purple p-2`}
      >
        {hoverContent}
      </div>
    </div>
    </>
  );
};
