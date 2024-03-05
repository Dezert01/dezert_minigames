import axios from "axios";
import { AnimatePresence, motion as m } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  index: number;
  tile: number | undefined;
  onClick: () => void;
  matched: boolean;
  show: boolean;
};

const MemoryTile: React.FC<Props> = ({
  tile,
  onClick,
  matched,
  show,
  index,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [element, setElement] = useState<string | undefined>(undefined);

  // to prevent animation going on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (matched) {
      axios
        .get("http://localhost:8080/memory/getElement/" + index)
        .then((res) => setElement(res.data));
    }
  }, [matched]);

  return (
    <div className="relative h-20 w-14">
      <AnimatePresence mode="wait">
        {!show && (
          <m.div
            key={`back-${index}`}
            initial={mounted ? { rotateY: "90deg" } : { rotateY: "0deg" }}
            animate={{ rotateY: "0deg" }}
            exit={{ rotateY: "90deg" }}
            transition={{ duration: 0.15, ease: "linear" }}
            onClick={onClick}
            className="absolute h-full w-full border-2 border-black bg-[#111111]"
          />
        )}
        {show && (
          <m.div
            key={`front-${index}`}
            initial={{ rotateY: "90deg" }}
            animate={{ rotateY: "0deg" }}
            exit={{ rotateY: "90deg" }}
            transition={{ duration: 0.15, ease: "linear" }}
            className="pointer-events-none absolute flex h-full w-full items-center justify-center border-2 border-green-500 bg-white text-green-500"
            style={{
              rotateY: "90deg",
            }}
          >
            {element !== undefined ? element : tile !== undefined && tile}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryTile;
