import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { TetrominoShape } from './Block';
import { rotationState, tetrominoState } from './State';

const TetrisComponent = () => {
  const [tetromino, setTetromino] = useRecoilState(tetrominoState);
  const [rotation, setRotation] = useRecoilState(rotationState);

  const rotate = (
    matrix: TetrominoShape,
    direction: number,
  ): TetrominoShape => {
    // Transpose the matrix
    const transposed = matrix[0].map((_, colIndex) =>
      matrix.map((row) => row[colIndex]),
    );
    // Reverse the matrix based on the direction of rotation
    if (direction > 0) {
      // Clockwise rotation
      return transposed.map((row) => row.reverse());
    } else {
      // Counter-clockwise rotation
      return transposed.reverse();
    }
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'w' || event.key === 'W') {
        setTetromino((prev) => rotate(prev, 1)); // Make sure rotate returns a new TetrominoShape
        setRotation((prev) => (prev + 1) % 4);
      } else if (event.key === 's' || event.key === 'S') {
        setTetromino((prev) => rotate(prev, -1)); // Make sure rotate returns a new TetrominoShape
        setRotation((prev) => (prev + 3) % 4);
      }
    },
    [setTetromino, setRotation],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // ... rest of your component
};

export default TetrisComponent;
