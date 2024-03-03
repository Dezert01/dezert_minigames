import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import MemoryTile from "./tile";

const MemoryGame: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [board, setBoard] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [firstToMatch, setFirstToMatch] = useState<number | undefined>(
    undefined,
  );
  const [secondToMatch, setSecondToMatch] = useState<number | undefined>(
    undefined,
  );
  const [matchedTiles, setMatchedTiles] = useState<number[]>([]);

  const startGame = async () => {
    if (!inputRef.current) {
      return;
    }
    const numberOfTiles = inputRef.current.value;

    try {
      const response = await axios.post("http://localhost:8080/memory/start", {
        numberOfTiles,
      });
      console.log("Game board generated:", response.data.gameBoard);
      setBoard(response.data.gameBoard);
      setGameRunning(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const axiosError = err as AxiosError;
        console.log("Server error status code:", axiosError.response?.status);
        console.log("Server error message:", axiosError.response?.data);
      }
    }
  };

  const stopGame = () => {
    resetGame();
  };

  const pressTile = (index: number) => {
    if (
      !gameRunning ||
      matchedTiles.includes(index) ||
      secondToMatch !== undefined
    ) {
      return;
    }
    if (firstToMatch === undefined) {
      setFirstToMatch(index);
    } else {
      setSecondToMatch(index);
    }
  };

  useEffect(() => {
    if (secondToMatch !== undefined) {
      // const timeout = setTimeout(() => {
      checkMatch();
      // }, 1000);

      // return () => clearTimeout(timeout);
    }
  }, [firstToMatch, secondToMatch]);

  const checkMatch = async () => {
    if (firstToMatch !== undefined && secondToMatch !== undefined) {
      try {
        // const timeout = setTimeout(() => {
        const response = await checkMatchPromise(firstToMatch, secondToMatch);
        console.log("Match status:", response.status);
        if (response.status === 1) {
          setMatchedTiles([...matchedTiles, firstToMatch, secondToMatch]);
          setFirstToMatch(undefined);
          setSecondToMatch(undefined);
        } else if (response.status === 2) {
          alert("Game is over, you are a winner!");
          resetGame();
        } else {
          setTimeout(() => {
            setFirstToMatch(undefined);
            setSecondToMatch(undefined);
          }, 500);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    }
  };

  const checkMatchPromise = async (
    firstIndex: number,
    secondIndex: number,
  ): Promise<{ status: number }> => {
    try {
      const response = await axios.post(
        "http://localhost:8080/memory/checkMatch",
        {
          tiles: [firstIndex, secondIndex],
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const resetGame = () => {
    setGameRunning(false);
    setFirstToMatch(undefined);
    setSecondToMatch(undefined);
    setMatchedTiles([]);
    setBoard([0, 0, 0, 0, 0, 0, 0, 0]);
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
              placeholder="Number of tiles"
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
      <div className="flex max-w-[40rem] flex-wrap justify-center gap-3 border-2 border-blue-200">
        {board.map((el, index) => (
          <MemoryTile
            matched={
              matchedTiles.includes(index) ||
              index === firstToMatch ||
              index === secondToMatch
            }
            key={index}
            tile={{ index: index, el: el }}
            onClick={() => pressTile(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
