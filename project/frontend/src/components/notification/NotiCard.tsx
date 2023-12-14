import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { getGameSocket } from '../pong/gameSocket';
import useNewFriend from './NewFriendToast';

interface NotiCardProps {
  content: string;
}

export const NotiCard: React.FC<NotiCardProps> = ({ content }) => {
  const [friendRequest, setFriendRequest] = useState(false);
  const sizeCSS = 'h-[60px] text-md';
  const colorCSS =
    'bg-white border-3 border-default rounded-md hover:bg-light-background';
  const alignCSS = 'flex items-center relative p-sm';
  let obj = JSON.parse(content);
  const { openNewFriend, closeNewFriend, setFriendName } = useNewFriend();
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
      if (!friendRequest) {
        await api.userFollowControllerFollowUser({ targetUser: sourceId });
        setFriendName(sourceName);
        openNewFriend();
        setTimeout(() => closeNewFriend(), 2000);
        console.log('Friend successfully');
        setFriendRequest(true);
      }
    } catch (error) {
      console.error('Error friend:', error);
    }
  }, [
    api,
    sourceId,
    openNewFriend,
    closeNewFriend,
    sourceName,
    setFriendName,
    friendRequest,
  ]);

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
