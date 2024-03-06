type Props = {
  status: boolean;
  onClick: () => void;
};

const LightsoutTile: React.FC<Props> = ({ status, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="aspect-square border-2 border-red-200"
      style={{ backgroundColor: status ? "green" : "" }}
    ></div>
  );
};

export default LightsoutTile;
