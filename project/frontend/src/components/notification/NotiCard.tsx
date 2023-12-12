import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { getGameSocket } from '../pong/gameSocket';

interface NotiCardProps {
  content: string;
}

export const NotiCard: React.FC<NotiCardProps> = ({ content }) => {
  const sizeCSS = 'h-[60px] text-md';
  const colorCSS =
    'bg-white border-3 border-default rounded-md hover:bg-light-background';
  const alignCSS = 'flex items-center relative p-sm';
  let obj = JSON.parse(content);
  const [showFriendToast, setShowFriendToast] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { api } = useContext(ApiContext);
  const route = useRouter();
  const sourceId = obj.sourceId;
  const sourceName = obj.sourceName;
  const mode = obj.mode;
  const socket = getGameSocket();

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  const requestFriend = useCallback(async () => {
    try {
      await api.userFollowControllerFollowUser({ targetUser: sourceId });
      setShowFriendToast(true);
      setTimeout(() => setShowFriendToast(false), 2000);
      console.log('Friend successfully');
    } catch (error) {
      console.error('Error friend:', error);
    }
  }, [api, sourceId]);

  useEffect(() => {
    const handleGoPong = () => {
      route.push('/pong');
    };
    socket.on('GoPong', handleGoPong);
    return () => {
      socket.off('GoPong', handleGoPong);
    };
  }, [socket, route]);

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
        if (mode === 'normal') {
          socket.emit('acceptNormalMatch', sourceId);
        } else if (mode === 'item') {
          socket.emit('acceptItemMatch', sourceId);
        }
      };
      break;
    default:
      return null;
  }
  return (
    <>
      {showFriendToast && (
        <div className="fixed w-[300px] h-[100px] left-1/2 transform -translate-x-1/2 -translate-y-[430%] flex justify-center items-center bg-default border-3 border-dark-purple text-dark-purple rounded-md z-50">
          {sourceName}님과 친구가 되었습니다!
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
