// src/contexts/GameContext.js
import { h } from "preact";
import { createContext } from "preact";
import { useState } from "preact/hooks";

export const GameContext = createContext();

export function GameProvider({ children }) {
  //hero classes
  const [heroes, setHeroes] = useState([
    { id: "Pa", name: "Paladin", hp: 3, atk: 0.5, def: 1 },
    { id: "Kn", name: "Knight", hp: 2, atk: 1, def: 0.5 },
    { id: "Nc", name: "Necromancer", hp: 1, atk: 0, def: 0.3 },
    { id: "Re", name: "Revived", hp: 1, atk: 0.5, def: 0.1 },
    { id: "Pr", name: "Priest", hp: 1, atk: 0.2, def: 0.2 },
    { id: "Bd", name: "Bard", hp: 1, atk: 0.3, def: 0.2 },
    { id: "Rg", name: "Ranger", hp: 1, atk: 0.8, def: 0.2 },
    { id: "As", name: "Assassin", hp: 1, atk: 0.9, def: 0.4 },
    { id: "Mg", name: "Mage", hp: 1, atk: 0.9, def: 0.3 },
    { id: "Wl", name: "Warlock", hp: 2, atk: 0.6, def: 0.3 },
  ]);
  //enemy classes
  const [enemies, setEnemies] = useState([
    { id: "S1", name: "Slime", hp: 1, atk: 0.2, def: 0 },
    { id: "Gb", name: "Goblin", hp: 1, atk: 0.2, def: 0.2 },
    { id: "Oc", name: "Orc", hp: 2, atk: 0.6, def: 0.2 },
    { id: "SA", name: "Skeleton Archer", hp: 1, atk: 0.7, def: 0.1 },
    { id: "SM", name: "Skeleton Mage", hp: 1, atk: 0.8, def: 0.1 },
    { id: "Wr", name: "Wraith", hp: 1, atk: 0.6, def: 1 },
    { id: "Rv", name: "Revenant", hp: 3, atk: 0.8, def: 0.7 },
    { id: "Mn", name: "Minotaur", hp: 4, atk: 0.5, def: 0.8 },
    { id: "Wy", name: "Wyvern", hp: 4, atk: 0.7, def: 0.7 },
    { id: "Me", name: "Medusa", hp: 2, atk: 1, def: 0.2 },
    { id: "Bs", name: "Basilisk", hp: 4, atk: 0.6, def: 0.6 },
    { id: "XX", name: "Aredhel of the Pestilence", hp: 10, atk: 1, def: 0.9 },
  ]);

  return (
    <GameContext.Provider value={{ heroes, setHeroes, enemies, setEnemies }}>
      {children}
    </GameContext.Provider>
  );
}
