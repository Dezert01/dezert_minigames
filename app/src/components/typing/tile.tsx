type Props = {
  element: string;
  state: 0 | 1 | 2;
};

const TypingTile: React.FC<Props> = ({ element, state }) => {
  return (
    <div
      className="flex aspect-square w-20 items-center justify-center border-2 text-2xl uppercase"
      style={{
        color: state === 0 ? "gray" : state === 1 ? "green" : "red",
        borderColor: state === 0 ? "gray" : state === 1 ? "green" : "red",
      }}
    >
      {element}
    </div>
  );
};

export default TypingTile;
