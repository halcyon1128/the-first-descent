// src/contexts/PlayerContext.js
import { createContext } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";
import { GameContext } from "./GameContext";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const { hero, enemy } = useContext(GameContext);

  const [heroRoster, setHeroRoster] = useState({ front: [], back: [] });
  const [enemyRoster, setEnemyRoster] = useState({ front: [], back: [] });

  useEffect(() => {
    if (hero && enemy) {
      setHeroRoster({
        front: [
          {
            id: "Knight",
            hp: 2,
            atk: hero["Knight"].atk,
            def: hero["Knight"].def,
            status: "healthy",
          },
        ],
        back: [
          {
            id: "Ranger",
            hp: 1,
            atk: hero["Ranger"].atk,
            def: hero["Ranger"].def,
            status: "healthy",
          },
          {
            id: "Priest",
            hp: 1,
            atk: hero["Priest"].atk,
            def: hero["Priest"].def,
            status: "healthy",
          },
        ],
      });

      setEnemyRoster({
        front: [
          {
            id: "Orc",
            hp: 2,
            atk: enemy["Orc"].atk,
            def: enemy["Orc"].def,
            status: "healthy",
          },
          {
            id: "Slime",
            hp: 1,
            atk: enemy["Slime"].atk,
            def: enemy["Slime"].def,
            status: "healthy",
          },
        ],
        back: [
          {
            id: "Skeleton_Mage",
            hp: 1,
            atk: enemy["Skeleton_Mage"].atk,
            def: enemy["Skeleton_Mage"].def,
            status: "healthy",
          },
        ],
      });
    }
  }, [hero, enemy]);

  return (
    <PlayerContext.Provider
      value={{ heroRoster, enemyRoster, setHeroRoster, setEnemyRoster }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
