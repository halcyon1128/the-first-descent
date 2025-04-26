// src/components/Card.jsx
import { h } from "preact";
import { useContext } from "preact/hooks";
import { GameContext } from "../contexts/GameContext";

export default function Card({ id, hp, status }) {
  const { heroes, enemies } = useContext(GameContext);

  // Find the unit in either heroes or enemies based on id
  const unit =
    heroes.find((hero) => hero.id === id) ||
    enemies.find((enemy) => enemy.id === id);

  if (!unit) {
    return (
      <div class="p-4 border border-gray-700 bg-gray-800 text-gray-400 rounded-lg shadow-md">
        Unit not found
      </div>
    );
  }

  return (
    <div class="p-4 border border-gray-700 bg-gray-800 text-gray-300 rounded-lg shadow-md flex flex-col gap-2">
      <div class="font-bold text-yellow-600">
        {heroes.some((hero) => hero.id === id) ? "🛡 Hero" : "⚔ Enemy"}
      </div>
      <div class=" text-gray-200">{unit.name}</div>
      <div class="text-green-400">HP: {hp ?? unit.hp}</div>
      <div class="text-red-400">Status: {status}</div>
    </div>
  );
}
