// src/contexts/PlayerContext.js
import { createContext } from "preact";
import { useState, useEffect } from "preact/hooks";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [heroRoster, setHeroRoster] = useState({ front: [], back: [] });
  const [enemyRoster, setEnemyRoster] = useState({ front: [], back: [] });

  // Run only once on mount
  useEffect(() => {
    setHeroRoster({
      front: [
        {
          id: "Reinhardt", // Added unique ID
          type: "Knight", // Renamed original id to type
          hp: 2,
          maxHp: 2, // Added maxHp
          atk: 1,
          def: 0.5,
          status: "healthy", // Uncommented/Set status
        },
      ],
      back: [
        {
          id: "Sully", // Added unique ID
          type: "Ranger", // Renamed original id to type
          hp: 1,
          maxHp: 1, // Added maxHp
          atk: 0.8,
          def: 0.2,
          status: "healthy", // Uncommented/Set status
        },
        {
          id: "Julian", // Added unique ID
          type: "Priest", // Renamed original id to type
          hp: 1,
          maxHp: 1, // Added maxHp
          atk: 0.2,
          def: 0.2,
          status: "healthy", // Uncommented/Set status
        },
      ],
    });

    setEnemyRoster({
      front: [
        {
          id: "Muck-muck", // Added unique ID
          type: "Slime", // Renamed original id to type
          hp: 1,
          maxHp: 1, // Added maxHp
          atk: 0.2,
          def: 0,
          status: "healthy", // Uncommented/Set status
        },
        {
          id: "Kazuma", // Added unique ID
          type: "Orc", // Renamed original id to type
          hp: 2,
          maxHp: 2, // Added maxHp
          atk: 0.6,
          def: 0.2,
          status: "healthy", // Uncommented/Set status
        },
      ],
      back: [
        {
          id: "Pontus", // Added unique ID
          type: "Skeleton_Mage", // Renamed original id to type
          hp: 1,
          maxHp: 1, // Added maxHp
          atk: 0.8,
          def: 0.1,
          status: "healthy", // Uncommented/Set status
        },
        {
          id: "Brutus", // Added unique ID
          type: "Skeleton_Archer", // Renamed original id to type
          hp: 1,
          maxHp: 1, // Added maxHp
          atk: 0.7,
          def: 0.1,
          status: "maimed", // Kept original status
        },
      ],
    });
  }, []); // Added empty dependency array
  return (
    <PlayerContext.Provider
      value={{ heroRoster, enemyRoster, setHeroRoster, setEnemyRoster }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
