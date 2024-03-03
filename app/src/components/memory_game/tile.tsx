import { AnimatePresence, motion as m } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  tile: {
    index: number;
    el: number;
  };
  onClick: () => void;
  matched: boolean;
};

const MemoryTile: React.FC<Props> = ({ tile, onClick, matched }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  // to prevent animation going on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative h-20 w-14">
      <AnimatePresence mode="wait">
        {!matched && (
          <m.div
            key={`back-${tile.index}`}
            initial={mounted ? { rotateY: "90deg" } : { rotateY: "0deg" }}
            animate={{ rotateY: "0deg" }}
            exit={{ rotateY: "90deg" }}
            transition={{ duration: 0.15, ease: "linear" }}
            onClick={onClick}
            className="absolute h-full w-full border-2 border-black bg-[#111111]"
          >
            {/* {tile.el} */}
          </m.div>
        )}
        {matched && (
          <m.div
            key={`front-${tile.index}`}
            initial={{ rotateY: "90deg" }}
            animate={{ rotateY: "0deg" }}
            exit={{ rotateY: "90deg" }}
            transition={{ duration: 0.15, ease: "linear" }}
            className="pointer-events-none absolute flex h-full w-full items-center justify-center border-2 border-green-500 bg-white text-green-500"
            style={{
              rotateY: "90deg",
            }}
          >
            {tile.el}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryTile;
