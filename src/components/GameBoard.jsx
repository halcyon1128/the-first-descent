// src/components/GameBoard.jsx
import { h } from "preact";
import { useContext } from "preact/hooks";
import { PlayerContext } from "../contexts/PlayerContext";
import { ActionContext } from "../contexts/ActionContext";
import Card from "./Card";

export default function GameBoard() {
  const { heroRoster, enemyRoster } = useContext(PlayerContext);
  const { selectUnit } = useContext(ActionContext); // Removed engageUnits

  return (
    <div class="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center py-2 text-xs md:text-lg lg:text-lg">
      {/* Enemy Formation */}
      <div class="flex flex-row gap-2 justify-center">
        {enemyRoster.back.map((unit) => (
          <Card
            key={unit.id}
            {...unit}
            onClick={() => selectUnit(unit, "enemy")}
            team="enemy"
          />
        ))}
      </div>
      <div class="flex flex-row gap-2 mt-2 justify-center ">
        {enemyRoster.front.map((unit) => (
          <Card
            key={unit.id}
            {...unit}
            onClick={() => selectUnit(unit, "enemy")}
            team="enemy"
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
            team="hero"
          />
        ))}
      </div>
      <div class="flex flex-row gap-2 mt-2 justify-center">
        {heroRoster.back.map((unit) => (
          <Card
            key={unit.id}
            {...unit}
            onClick={() => selectUnit(unit, "hero")}
            team="hero"
          />
        ))}
      </div>

      {/* Engage button removed */}
    </div>
  );
}
