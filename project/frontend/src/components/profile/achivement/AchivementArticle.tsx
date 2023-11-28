import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { Loading } from '@/components/common/Loading';
import { Title } from '@/components/common/Title';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { ProfileButton } from '../ProfileButton';
import { Badge } from './Badge';
import { mockAchivementData } from './mockAchivementData';

export function AchivementArticle() {
  const { api } = useContext(ApiContext);
  const { isLoading, isError, data } = useQuery(
    ['achivement'],
    useCallback(
      async () => (await api.userFollowControllerFindFriends()).data,
      [api],
    ),
  );
  return (
    <div className="relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <Title location="top-center">업적</Title>
        <ProfileButton href="/profile" text="돌아가기" />
        <div className="w-[700px] mt-3xl p-md flex justify-center">
          {render()}
        </div>
      </div>
    </div>
  );

  function render() {
    if (isLoading) return <Loading width={500} />;

    if (isError || !data) {
      return (
        <p className="font-normal text-h2 text-center">Something went wrong</p>
      );
    }

    if (data.length === 0) {
      return <p className="font-semibold text-h2 text-center">No elements</p>;
    }

    return (
      <div className="grid grid-cols-3 w-[700px] h-[500px] gap-xl p-md overflow-y-scroll">
        {mockAchivementData.map((badge) => (
          <Badge
            key={badge.key}
            nameContent={badge.name}
            commentContent={badge.explanation}
            imageURL={badge.imageURL}
            isMine={badge.isMine}
          />
        ))}
      </div>
    );
  }
}
