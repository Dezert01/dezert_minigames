import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import MemoryTile from "./tile";

const MemoryGame: React.FC = () => {
  console.log("rerender");
  const inputRef = useRef<HTMLInputElement>(null);
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [boardLength, setBoardLength] = useState<number | undefined>(undefined);
  const [board, setBoard] = useState<number[]>([]);
  const [firstToMatch, setFirstToMatch] = useState<number | undefined>(
    undefined,
  );
  const [secondToMatch, setSecondToMatch] = useState<number | undefined>(
    undefined,
  );
  const [tileOne, setTileOne] = useState<number | undefined>(undefined);
  const [tileTwo, setTileTwo] = useState<number | undefined>(undefined);
  const [matchedTiles, setMatchedTiles] = useState<number[]>([]);

  const startGame = async () => {
    if (!inputRef.current) {
      return;
    }
    const numberOfTiles = inputRef.current.value;

    try {
      axios
        .post("http://localhost:8080/memory/start", {
          numberOfTiles,
        })
        .then((res) => {
          setBoardLength(res.data.numberOfTiles);
          setGameRunning(true);
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
    setFirstToMatch(undefined);
    setSecondToMatch(undefined);
    setTileOne(undefined);
    setTileTwo(undefined);
    setMatchedTiles([]);
    setBoard([]);
    setBoardLength(undefined);
  };

  const pressTile = async (index: number) => {
    if (
      !gameRunning ||
      matchedTiles.includes(index) ||
      secondToMatch !== undefined
    ) {
      return;
    }
    if (firstToMatch === undefined) {
      setFirstToMatch(index);
      setTileOne(await getElement(index));
    } else {
      setSecondToMatch(index);
      setTileTwo(await getElement(index));
    }
  };

  useEffect(() => {
    if (secondToMatch !== undefined) {
      checkMatch();
    }
  }, [firstToMatch, secondToMatch]);

  useEffect(() => {
    if (boardLength && boardLength > 0) {
      const board = [];
      for (let i = 0; i < boardLength; i++) {
        board.push(i);
      }
      setBoard(board);
    }
  }, [boardLength]);

  const checkMatch = async () => {
    if (firstToMatch !== undefined && secondToMatch !== undefined) {
      try {
        await checkMatchPromise(firstToMatch, secondToMatch).then((res) => {
          if (res.status === 1) {
            setMatchedTiles([...matchedTiles, firstToMatch, secondToMatch]);
            setFirstToMatch(undefined);
            setSecondToMatch(undefined);
            setTileOne(undefined);
            setTileTwo(undefined);
          } else if (res.status === 2) {
            alert("Game is over, you are a winner!");
            stopGame();
          } else {
            setTimeout(() => {
              setFirstToMatch(undefined);
              setSecondToMatch(undefined);
              setTileOne(undefined);
              setTileTwo(undefined);
            }, 500);
          }
        });
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

  const getElement = async (index: number) => {
    const element = axios
      .get("http://localhost:8080/memory/getElement/" + index)
      .then(function (response) {
        return response.data;
      });
    return element;
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
        {board.length > 0 &&
          board.map((el) => (
            <MemoryTile
              index={el}
              matched={matchedTiles.includes(el)}
              show={
                el === firstToMatch ||
                el === secondToMatch ||
                matchedTiles.includes(el)
              }
              key={el}
              tile={
                el === firstToMatch
                  ? tileOne
                  : el === secondToMatch
                    ? tileTwo
                    : undefined
              }
              onClick={() => pressTile(el)}
            />
          ))}
      </div>
    </div>
  );
};

export default MemoryGame;
