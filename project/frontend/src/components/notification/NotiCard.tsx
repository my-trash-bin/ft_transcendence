import React, { useState } from 'react';
import { useCallback, useContext } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';

interface NotiCardProps {
  isRead: boolean;
  content: string;
}

export const NotiCard: React.FC<NotiCardProps> = ({ content }) => {
  const sizeCSS = 'h-[60px] text-sm';
  const colorCSS =
    'bg-white border-3 border-default rounded-md hover:bg-light-background';
  const alignCSS = 'flex items-center relative p-sm';
  let obj = JSON.parse(content);

  const [isHovered, setHovered] = useState(false);
  const { api } = useContext(ApiContext);
  const sourceId = obj.sourceId;
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
      notificationContent = `${obj.sourceName}가 당신을 친구로 추가했습니다.`;
      hoverContent = '나도 친구로 추가';
      handlerFunction = requestFriend;
      break;
    case 'newMessageDm':
      notificationContent = `${obj.sourceName}으로부터 새로운 메세지가 도착했습니다.`;
      hoverContent = '메세지창으로 이동';
      handlerFunction = () => alert('move to dm');
      break;
    case 'newMessageChannel':
      notificationContent = `${obj.sourceName}으로부터 새로운 메세지가 도착했습니다.`;
      hoverContent = '메세지창으로 이동';
      handlerFunction = () => alert('move to channel');
      break;
    case 'gameRequest':
      notificationContent = `${obj.sourceName}가 1대1 게임을 요청했습니다.`;
      hoverContent = '게임 참여하기';
      handlerFunction = () => alert('game api');
      break;
    default:
      return null; // Handle unknown type or return a default component
  }

  return (
    <div
      className={`group ${sizeCSS} ${colorCSS} ${alignCSS}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => handlerFunction()}
    >
      <div className={`relative ${isHovered ? 'hidden' : 'block'}`}>
        {notificationContent}
      </div>
      <div
        className={`absolute ${
          isHovered ? 'block' : 'hidden'
        } bg-light-purple p-2`}
      >
        {hoverContent}
      </div>
    </div>
  );
};
