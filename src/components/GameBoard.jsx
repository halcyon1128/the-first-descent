// src/components/GameBoard.jsx
import { h } from "preact";
import { useContext } from "preact/hooks";
import { GameContext } from "../contexts/GameContext";
import Card from "./Card";

export default function GameBoard() {
  const { heroes, enemies } = useContext(GameContext);

  // Instance rows correctly

  const heroRoster = [{
    front: [ 
      {heroes[kn,], }
    ], back: [
    
  ]}]
  const enmeyRoster = [{
    front: [
    
    ], back: [
    
  ]}]

  const heroFrontline = 
  const heroBackline = 
  const enemyFrontline = 
  const enemyBackline = 

  return (
    <div class="h-screen w-screen bg-gray-900 text-gray-300 flex flex-col items-center justify-center py-4">
      {/* Enemy Formation */}
      <div class="grid grid-cols-3 gap-2">
        {enemyFrontline.map((unit) => (
          <Card key={unit.id} id={unit.id} hp={unit.hp} status="Aggressive" />
        ))}
      </div>
      <div class="grid grid-cols-2 gap-2 mt-2">
        {enemyBackline.map((unit) => (
          <Card key={unit.id} id={unit.id} hp={unit.hp} status="Waiting" />
        ))}
      </div>

      {/* Empty center (Reserved for battle animations) */}
      <div class="h-16"></div>

      {/* Hero Formation */}
      <div class="grid grid-cols-2 gap-2 mt-2">
        {heroFrontline.map((unit) => (
          <Card key={unit.id} id={unit.id} hp={unit.hp} status="Ready" />
        ))}
      </div>
      <div class="grid grid-cols-1 gap-2 mt-2">
        {heroBackline.map((unit) => (
          <Card key={unit.id} id={unit.id} hp={unit.hp} status="Focused" />
        ))}
      </div>
    </div>
  );
}
