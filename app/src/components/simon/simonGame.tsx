import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import SimonTile from "./tile";

const SimonGame: React.FC = () => {
  const sizeInputRef = useRef<HTMLInputElement>(null);
  const roundsInputRef = useRef<HTMLInputElement>(null);
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<number | undefined>(undefined);
  const [board, setBoard] = useState<number[]>([]);
  const [blocked, setBlocked] = useState<boolean>(true);
  const [highlighted, setHighlighted] = useState<number | undefined>(undefined);

  const startGame = async () => {
    if (
      !sizeInputRef.current ||
      !sizeInputRef.current.value ||
      !roundsInputRef.current ||
      !roundsInputRef.current.value
    ) {
      return;
    }

    const boardSize = Number(sizeInputRef.current.value);
    const roundsNumber = Number(roundsInputRef.current.value);

    try {
      await axios
        .post("http://localhost:8080/simon/start", { boardSize, roundsNumber })
        .then((res) => {
          setGameRunning(true);
          setBoardSize(res.data.boardSize);
          highlightTiles(res.data.roundMoves);
        });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const axiosError = err as AxiosError;
        console.log("Server error status code:", axiosError.response?.status);
        console.log("Server error message:", axiosError.response?.data);
      }
    }
  };
  const stopGame = () => {};
  const sleepNow = (delay: number) =>
    new Promise((resolve) => setTimeout(resolve, delay));

  const highlightTiles = async (tiles: number[]) => {
    console.log(tiles);
    setBlocked(true);

    for (let i = 0; i < tiles.length; i++) {
      await sleepNow(500);
      setHighlighted(tiles[i]);
      // setTimeout(() => {
      //   console.log(tiles[i]);
      // }, 1000 * i);
    }
    await sleepNow(500);
    setHighlighted(undefined);
    setBlocked(false);
  };

  useEffect(() => {
    if (boardSize && boardSize > 0) {
      const board = [];
      const boardLength = boardSize * boardSize;
      for (let i = 0; i < boardLength; i++) {
        board.push(i);
      }
      setBoard(board);
    }
  }, [boardSize]);

  return (
    <div>
      {/* utils */}
      <div className="mb-4 flex w-full gap-2 text-white">
        {!gameRunning ? (
          <>
            <div className="flex flex-col gap-2">
              <input
                ref={sizeInputRef}
                type="number"
                placeholder="Number of tiles"
                className="border-[1px] border-[#c1c1c1] bg-transparent outline-none placeholder:text-[#c1c1c1]"
              />
              <input
                ref={roundsInputRef}
                type="number"
                placeholder="Number of rounds"
                className="border-[1px] border-[#c1c1c1] bg-transparent outline-none placeholder:text-[#c1c1c1]"
              />
            </div>
            <button onClick={startGame} className="bg-[#32D74B] px-4 uppercase">
              start
            </button>
          </>
        ) : (
          <button onClick={stopGame} className="bg-[#FF453A] px-4 uppercase">
            stop
          </button>
        )}
      </div>

      {/* board */}
      {boardSize && (
        <div className="flex justify-center">
          <div
            className="grid aspect-square gap-1 border-2 border-blue-200"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, minmax(2rem, 6rem))`,
              gridTemplateRows: `repeat(${boardSize}, minmax(2rem, 6rem))`,
            }}
          >
            {board.map((el) => {
              return <SimonTile key={el} highlighted={highlighted === el} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default SimonGame;
