import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { getGameSocket } from '../pong/gameSocket';

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
  const [isHovered, setHovered] = useState(false);
  const [isInvited, setIsInvited] = useState(false);
  const { api } = useContext(ApiContext);
  const route = useRouter();
  const sourceId = obj.sourceId;
  const sourceName = obj.sourceName;
  const mode = obj.mode;
  const socket = getGameSocket();

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

  const [showInvitationExpiredToast, setShowInvitationExpiredToast] =
    useState(false);

  useEffect(() => {
    const handleGameInvitationExpired = () => {
      if (!showInvitationExpiredToast) {
        console.log('gameInvitationExpired');
        setShowInvitationExpiredToast(true);
        setTimeout(() => setShowInvitationExpiredToast(false), 2000);
      }
    };
    if (isInvited) {
      socket.on('gameInvitationExpired', handleGameInvitationExpired);
    }
    return () => {
      if (isInvited) {
        socket.off('gameInvitationExpired', handleGameInvitationExpired);
      }
    };
  }, [
    socket,
    isInvited,
    setIsInvited,
    setShowInvitationExpiredToast,
    showInvitationExpiredToast,
  ]);

  // useEffect(() => {
  //   if (showInvitationExpiredToast) {
  //     setTimeout(() => setShowInvitationExpiredToast(false), 2000);
  //   }
  // }, [showInvitationExpiredToast, setShowInvitationExpiredToast]);

  useEffect(() => {
    // const handleCancelInvite = () => {
    //   setIsInvited(false);
    //   console.log('canceledInvite');
    // };
    const handleGoPong = () => {
      route.push('/pong');
    };

    // socket.on('canceledInvite', handleCancelInvite);
    socket.on('GoPong', handleGoPong);

    return () => {
      // socket.off('canceledInvite', handleCancelInvite);
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
        console.log('isInvited', isInvited);
        if (mode === 'normal') {
          socket.emit('acceptNormalMatch', sourceId);
        } else {
          socket.emit('acceptItemMatch', sourceId);
        }
        setIsInvited(true);
        // if (isInvited) {
        // } else {
        //   setShowInvitationExpiredToast(true);
        //   setTimeout(() => setShowInvitationExpiredToast(false), 3000);
        // }
      };
      break;
    default:
      return null;
  }

  console.log(`showInvitationExpiredToast: ${showInvitationExpiredToast}`);

  return (
    <>
      {showInvitationExpiredToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-default text-dark-purple-interactive rounded-sm w-[150px] h-[40px] z-50">
          만료된 초대입니다.
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
