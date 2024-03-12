type Props = {
  highlighted: Boolean;
};

const SimonTile: React.FC<Props> = ({ highlighted }) => {
  return (
    <div
      className="aspect-square border-2 border-green-500 hover:border-red-500"
      style={{ background: highlighted ? "green" : "transparent" }}
    ></div>
  );
};

export default SimonTile;
