import React from 'react';
import { TetrominoShape } from './Block';

type PreviewProps = {
  tetromino: TetrominoShape;
};

const Preview: React.FC<PreviewProps> = ({ tetromino }) => {
  const containerSize = 4 * 20;
  const tetrominoColor = 'bg-dark-purple-interactive';

  return (
    <div
      className="grid grid-cols-4"
      style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
    >
      {Array.from({ length: 4 }, (_, rowIndex) =>
        <React.Fragment key={rowIndex}>
          {Array.from({ length: 4 }, (_, cellIndex) => {
            const isFilled = tetromino[rowIndex]?.[cellIndex] === 1;
            return (
              <div
                key={cellIndex}
                className={`border border-default-interactive ${isFilled ? tetrominoColor : 'bg-transparent'}`}
                style={{ width: '20px', height: '20px' }}
              />
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
};

export default Preview;
