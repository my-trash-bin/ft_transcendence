'use client';
// ../../game/page.tsx
import withAuth from '@/components/auth/withAuth';
import { Title } from '@/components/common/Title';
import ButtonComponent from '@/components/game/GameButton';
import { GameFinishModal } from '@/components/game/GameFinishModal';
import { Ranking } from '../../components/game/Ranking';
import useStore from '../../components/pong/Update';

function GamePage() {
  const { gameOver } = useStore((state) => ({
    gameOver: state.gameOver,
  }));

  const handleCloseModal = () => {
    useStore.setState({ gameOver: false });
  };

  return (
    <div className="flex flex-row h-[100%] w-[100%]">
      <div className="w-[100%] h-[100%] bg-light-background rounded-lg">
        <div className="flex flex-row w-[100%]">
          <div className="flex flex-col items-center max-w-4xl mx-auto">
            <section className="flex justify-between w-[700px] py-xl">
              <ButtonComponent mode="normal" />
              <ButtonComponent mode="item" />
            </section>
            <Title font="big">순위</Title>
            <Ranking />
          </div>
        </div>
      </div>
      {gameOver && (
        <GameFinishModal isOpen={gameOver} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default withAuth(GamePage, 'game');
