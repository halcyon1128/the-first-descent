// src/contexts/GameContext.js
import { createContext } from "preact";
import { useState } from "preact/hooks";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [hero, setHero] = useState({
    Paladin: { hp: 3, atk: 0.5, def: 1 },
    Knight: { hp: 2, atk: 1, def: 0.5 },
    Necromancer: { hp: 1, atk: 0, def: 0.3 },
    Revived: { hp: 1, atk: 0.5, def: 0.1 },
    Priest: { hp: 1, atk: 0.2, def: 0.2 },
    Bard: { hp: 1, atk: 0.3, def: 0.2 },
    Ranger: { hp: 1, atk: 0.8, def: 0.2 },
    Assassin: { hp: 1, atk: 0.9, def: 0.4 },
    Mage: { hp: 1, atk: 0.9, def: 0.3 },
    Warlock: { hp: 2, atk: 0.6, def: 0.3 },
  });

  const [enemy, setEnemy] = useState({
    Slime: { hp: 1, atk: 0.2, def: 0 },
    Goblin: { hp: 1, atk: 0.2, def: 0.2 },
    Orc: { hp: 2, atk: 0.6, def: 0.2 },
    Skeleton_Archer: { hp: 1, atk: 0.7, def: 0.1 },
    Skeleton_Mage: { hp: 1, atk: 0.8, def: 0.1 },
    Wraith: { hp: 1, atk: 0.6, def: 1 },
    Revenant: { hp: 3, atk: 0.8, def: 0.7 },
    Minotaur: { hp: 4, atk: 0.5, def: 0.8 },
    Wyvern: { hp: 4, atk: 0.7, def: 0.7 },
    Medusa: { hp: 2, atk: 1, def: 0.2 },
    Basilisk: { hp: 4, atk: 0.6, def: 0.6 },
    Aredhel_of_the_Pestilence: { hp: 10, atk: 1, def: 0.9 },
  });

  // console.log("GameContext - Hero Keys:", Object.keys(hero));
  // console.log("GameContext - Enemy Keys:", Object.keys(enemy));

  return (
    <GameContext.Provider value={{ hero, setHero, enemy, setEnemy }}>
      {children}
    </GameContext.Provider>
  );
}
