// src/contexts/ActionContext.js
import { createContext } from "preact";
import { useState, useContext } from "preact/hooks";
import { PlayerContext } from "./PlayerContext";
import { simulateEngagement } from "../utils/combatUtils";

export const ActionContext = createContext();

export function ActionProvider({ children }) {
  // Pull the roster (and updater functions) from PlayerContext.
  const { heroRoster, enemyRoster, setEnemyRoster } = useContext(PlayerContext);

  // Hold the selected units internally.
  const [selectedAttacker, setSelectedAttacker] = useState(null);
  const [selectedDefender, setSelectedDefender] = useState(null);

  // A single selection function: based on the team parameter,
  // ActionContext will parse the PlayerContext object and set the
  // appropriate selection.
  const selectUnit = (unit, team) => {
    if (team === "hero") {
      // Search for the unit in the hero roster.
      const found =
        heroRoster.front.find((u) => u.id === unit.id) ||
        heroRoster.back.find((u) => u.id === unit.id);
      if (found) {
        setSelectedAttacker(found);
        console.log("Selected attacker:", found);
      }
    } else if (team === "enemy") {
      // Search for the unit in the enemy roster.
      const found =
        enemyRoster.front.find((u) => u.id === unit.id) ||
        enemyRoster.back.find((u) => u.id === unit.id);
      if (found) {
        setSelectedDefender(found);
        console.log("Selected defender:", found);
      }
    }
  };

  const engage = () => {
    if (!selectedAttacker || !selectedDefender) {
      console.warn("Both an attacker and defender must be selected.");
      return;
    }

    // Parse the enemy roster to see if the defender is in the 'front' or 'back'.
    // (This is our single source of truth.)
    let defenderRow = enemyRoster.front.find(
      (u) => u.id === selectedDefender.id
    )
      ? "front"
      : "back";
    // Create an object that includes the row placement.
    const defenderWithPlacement = {
      ...selectedDefender,
      placement: defenderRow,
    };

    // Run the modular simulation (imported from combatUtils.js).
    const result = simulateEngagement(
      selectedAttacker,
      defenderWithPlacement,
      enemyRoster
    );

    // If the attack outcome was "hit", update the enemy roster accordingly.
    if (result.outcome === "hit") {
      if (defenderRow === "front") {
        setEnemyRoster((prev) => ({
          ...prev,
          front: prev.front.map((u) =>
            u.id === selectedDefender.id ? { ...defenderWithPlacement } : u
          ),
        }));
      } else {
        setEnemyRoster((prev) => ({
          ...prev,
          back: prev.back.map((u) =>
            u.id === selectedDefender.id ? { ...defenderWithPlacement } : u
          ),
        }));
      }
    }
    console.log("Engagement result:", result);
    // Clear selections so that a new engagement can occur.
    setSelectedAttacker(null);
    setSelectedDefender(null);
    return result;
  };

  const actions = { selectUnit, engage };

  return (
    <ActionContext.Provider value={actions}>{children}</ActionContext.Provider>
  );
}
