import LightsoutGame from "./components/lightsout/lightsoutGame";
import MemoryGame from "./components/memory_game/memoryGame";
import SimonGame from "./components/simon/simonGame";

function App() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* <MemoryGame /> */}
      {/* <LightsoutGame /> */}
      <SimonGame />
    </div>
  );
}

export default App;
