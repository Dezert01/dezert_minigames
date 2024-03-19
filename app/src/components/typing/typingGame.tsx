import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import TypingTile from "./tile";

const TypingGame: React.FC = () => {
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameString, setGameString] = useState<string>("");
  const [wrongChar, setWrongChar] = useState<number | null>(null);
  const [currentChar, setCurrentChar] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = async () => {
    if (!inputRef.current || !inputRef.current.value) {
      return;
    }
    const stringLength = Number(inputRef.current.value);
    try {
      await axios
        .post("http://localhost:8080/typing/start", { stringLength })
        .then((res) => {
          setGameRunning(true);
          console.log(res);
          setGameString(res.data.gameString);
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
    setCurrentChar(0);
    setWrongChar(null);
    setGameString("");
  };

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (gameRunning && !isLoading) {
        setIsLoading(true);
        try {
          const response = await axios.post(
            "http://localhost:8080/typing/checkPress",
            {
              buttonPressed: event.key,
            },
          );
          if (response.data.status == 0) {
            // continue
            console.log("continue");
            setCurrentChar(currentChar + 1);
          } else if (response.data.status == 1) {
            setCurrentChar(currentChar + 1);
            // win
            console.log("end");
            setGameRunning(false);
            setTimeout(() => stopGame(), 1000);
          }
        } catch (error) {
          // lose
          setWrongChar(currentChar);
          setGameRunning(false);
          setTimeout(() => stopGame(), 1000);
          console.log("Wrong character, try again");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (gameRunning) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameRunning, isLoading]);

  return (
    <div>
      {/* utils */}
      <div className="mb-4 flex w-full gap-2 text-white">
        {!gameRunning && !gameString ? (
          <>
            <div className="flex flex-col gap-2">
              <input
                ref={inputRef}
                type="number"
                placeholder="Number of tiles"
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
      {gameString || gameRunning ? (
        <div className="w-50 flex flex-wrap justify-center gap-1">
          {gameString.split("").map((el, index) => {
            return (
              <TypingTile
                key={index}
                element={el}
                state={index < currentChar ? 1 : wrongChar === index ? 2 : 0}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default TypingGame;
