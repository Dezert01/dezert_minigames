type Props = {
  highlighted: Boolean;
  onClick: () => void;
};

const SimonTile: React.FC<Props> = ({ highlighted, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="aspect-square border-2 border-green-500 hover:bg-green-500"
      style={highlighted ? { background: "green" } : {}}
    ></div>
  );
};

export default SimonTile;
