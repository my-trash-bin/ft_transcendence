import BlockCard from './BlockCard';
import { mockFriends } from './utils/mockFriends';

function BlockCardList() {
  return (
    <div className="w-[700px] h-[600px] pt-xl grid gap-lg justify-center items-center overflow-y-scroll">
      {mockFriends.map((val) => {
        return (
          <BlockCard
            key={val.key}
            imageURL={val.imageURL}
            nickname={val.nickname}
          />
        );
      })}
    </div>
  );
}
export default BlockCardList;
