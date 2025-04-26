// src/components/GameBoard.jsx
import { h } from "preact";
import { useContext } from "preact/hooks";
import { PlayerContext } from "../contexts/PlayerContext";
import { ActionContext } from "../contexts/ActionContext";
import Card from "./Card";

export default function GameBoard() {
  const { heroRoster, enemyRoster } = useContext(PlayerContext);
  const { selectUnit, engage } = useContext(ActionContext);

  return (
    <div class="h-screen w-screen bg-gray-900 text-gray-300 flex flex-col items-center justify-center py-2 text-xxs md:text-lg lg:text-lg">
      {/* Enemy Formation */}
      <div class="flex flex-row gap-2 justify-center">
        {enemyRoster.front.map((unit) => (
          <Card
            key={unit.id}
            {...unit}
            onClick={() => selectUnit(unit, "enemy")}
          />
        ))}
      </div>
      <div class="flex flex-row gap-2 mt-2 justify-center">
        {enemyRoster.back.map((unit) => (
          <Card
            key={unit.id}
            {...unit}
            onClick={() => selectUnit(unit, "enemy")}
          />
        ))}
      </div>

      {/* Reserved center area for animations, etc. */}
      <div class="h-16"></div>

      {/* Hero Formation */}
      <div class="flex flex-row gap-2 mt-2 justify-center">
        {heroRoster.front.map((unit) => (
          <Card
            key={unit.id}
            {...unit}
            onClick={() => selectUnit(unit, "hero")}
          />
        ))}
      </div>
      <div class="flex flex-row gap-2 mt-2 justify-center">
        {heroRoster.back.map((unit) => (
          <Card
            key={unit.id}
            {...unit}
            onClick={() => selectUnit(unit, "hero")}
          />
        ))}
      </div>

      {/* Engage button to trigger combat */}
      <button
        onClick={engage}
        class="mt-4 px-4 py-2 bg-green-600 rounded focus:outline-none"
      >
        Engage!
      </button>
    </div>
  );
}
