import { useEffect, useRef, useState } from "react";
import LightsoutTile from "./tile";
import axios, { AxiosError } from "axios";

const LightsoutGame: React.FC = () => {
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<number | undefined>(undefined);
  const [board, setBoard] = useState<boolean[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = async () => {
    if (!inputRef.current) {
      return;
    }

    const boardSize = Number(inputRef.current.value);

    try {
      await axios
        .post("http://localhost:8080/lightsout/start", { boardSize })
        .then((res) => {
          setGameRunning(true);
          console.log(res.data);
          setBoard(res.data.gameBoard);
          setBoardSize(boardSize);
        });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const axiosError = err as AxiosError;
        console.log("Server error status code:", axiosError.response?.status);
        console.log("Server error message:", axiosError.response?.data);
      }
    }
  };

  const stopGame = () => {
    setGameRunning(false);
    setBoard([]);
    setBoardSize(undefined);
  };

  const pressTile = async (index: number) => {
    try {
      await axios
        .post("http://localhost:8080/lightsout/checkTile", { index, boardSize })
        .then((res) => {
          if (res.data.status) {
            alert("Game is over, you are a winner!");
            stopGame();
          } else {
            setBoard(res.data.gameBoard);
          }
        });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const axiosError = err as AxiosError;
        console.log("Server error status code:", axiosError.response?.status);
        console.log("Server error message:", axiosError.response?.data);
      }
    }
  };

  return (
    <div>
      {/* utils */}
      <div className="mb-4 flex w-full gap-4 text-white">
        {!gameRunning ? (
          <>
            <input
              ref={inputRef}
              type="number"
              placeholder="Board size (5 or 9 only)"
              className="border-[1px] border-[#c1c1c1] bg-transparent outline-none placeholder:text-[#c1c1c1]"
            />
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
            {board.map((el, index) => (
              <LightsoutTile
                key={index}
                status={el}
                onClick={() => pressTile(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LightsoutGame;
