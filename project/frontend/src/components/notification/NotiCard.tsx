interface NotiCardProps {
  isRead: boolean;
  content: string;
}

export const NotiCard: React.FC<NotiCardProps> = ({ isRead, content }) => {
  const sizeCSS = 'h-[75px] text-sm';
  const colorCSS = 'bg-white border-3 border-default rounded-md';
  const alignCSS = 'flex items-center relative p-md';
  let obj = JSON.parse(content);

  function typeHandler() {
    let notificationContent;

    switch (obj.type) {
      case 'newFriend':
        notificationContent = `${obj.sourceName}가 당신을 친구로 추가했습니다. 클릭해서 나도 친구로 추가`;
        break;
      case 'newMessageDm':
        notificationContent = `${obj.sourceName}으로부터 새로운 메세지가 도착했습니다. 클릭해서 채팅창으로 이동`;
        break;
      case 'newMessageChannel':
        notificationContent = `${obj.sourceName}으로부터 새로운 메세지가 도착했습니다. 클릭해서 채팅창으로 이동`;
        break;
      case 'gameRequest':
        notificationContent = `${obj.sourceName}가 1대1 게임을 요청했습니다. 클릭해서 게임에 참여`;
        break;
      default:
        return null; // Handle unknown type or return a default component
    }

    return (
      <div className={`${sizeCSS} ${colorCSS} ${alignCSS}`}>
        {notificationContent}
      </div>
    );
  }

  return typeHandler();
};
