// src/contexts/ActionContext.js
import { createContext } from "preact";
import { useState, useContext, useCallback } from "preact/hooks"; // Combined imports
import { PlayerContext } from "./PlayerContext";
import { rollAttack, rollDefend, updateTarget } from "../utils/combatUtils";

export const ActionContext = createContext();

export function ActionProvider({ children }) {
  const { heroRoster, enemyRoster, setEnemyRoster } = useContext(PlayerContext);
  const [selectedAttacker, setSelectedAttacker] = useState(null);
  // No need for selectedDefender state anymore, it's transient

  // Internal function to handle combat resolution
  const _resolveCombat = useCallback(
    (attacker, defender) => {
      // Ensure both units are not killed before proceeding
      if (attacker.status === 'killed' || defender.status === 'killed') {
        console.warn("Cannot engage with a killed unit.");
        setSelectedAttacker(null); // Reset selection if invalid
        return;
      }

      console.log("Engaging units:", attacker, defender);

      // Phase 1: Attack roll.
      // Pass attacker's atk stat to rollAttack
      if (!rollAttack(attacker.atk)) {
        console.log(`${attacker.name} missed ${defender.name}.`);
        return { outcome: "miss" };
      }
      console.log(`${attacker.name}'s attack roll succeeded.`);

      // Phase 2: Defense roll.
      // Pass defender's def stat to rollDefend
      if (rollDefend(defender.def)) {
        console.log(`${defender.name} deflected the attack.`);
        return { outcome: "defended" };
      }
      console.log(`${defender.name}'s defense roll failed; damage goes through.`);

      // Phase 3: Update target's HP.
      const updatedDefender = updateTarget(defender);
      console.log(
        `${defender.name} takes 1 damage. HP: ${updatedDefender.hp}`
      );

      // Update enemy roster
      setEnemyRoster((prev) => {
        const newFront = prev.front.map((u) =>
          u.id === defender.id ? updatedDefender : u
        );
        const newBack = prev.back.map((u) =>
          u.id === defender.id ? updatedDefender : u
        );
        return { front: newFront, back: newBack };
      });

      return { outcome: "hit" };
    },
    [enemyRoster, setEnemyRoster] // Dependencies for useCallback
  );

  // Refactored selection function
  const selectUnit = useCallback(
    (unit, team) => {
      if (team === "hero") {
        // Find the hero unit from the roster to ensure we have the latest state
        const foundHero =
          heroRoster.front.find((u) => u.id === unit.id) ||
          heroRoster.back.find((u) => u.id === unit.id);

        if (foundHero) {
          // Prevent selecting a killed hero
          if (foundHero.status === 'killed') {
            console.log(`${foundHero.name} is killed and cannot attack.`);
            return; // Do nothing if the hero is killed
          }

          // If this hero is already selected, deselect it.
          if (selectedAttacker && selectedAttacker.id === foundHero.id) {
             console.log(`Deselected attacker: ${foundHero.name}`);
             return setSelectedAttacker(foundHero.name);
             
          } else {
             console.log(`Selected attacker: ${foundHero.name}`);
             return setSelectedAttacker(foundHero);
          }
        }
      } else if (team === "enemy" && selectedAttacker) {
        // Find the enemy unit from the roster
        const foundEnemy =
          enemyRoster.front.find((u) => u.id === unit.id) ||
          enemyRoster.back.find((u) => u.id === unit.id);

        if (foundEnemy) {
           // Prevent targeting a killed enemy
           if (foundEnemy.status === 'killed') {
             console.log(`${foundEnemy.name} is already killed.`);
             return; // Do nothing if the target is killed
           }
          console.log(`Selected target: ${foundEnemy.name}`);
          // Attacker is selected, and an enemy is clicked: resolve combat
          _resolveCombat(selectedAttacker, foundEnemy);
          // Reset attacker selection after combat
          setSelectedAttacker(null);
        }
      } else if (team === "enemy" && !selectedAttacker) {
         console.warn("Please select a hero attacker first.");
      } else {
         // Handle other cases like clicking an empty space or invalid target?
         // For now, just reset selection if a hero clicks another hero
         if (team === "hero" && selectedAttacker) {
            console.log("Invalid target. Select an enemy.");
            // Optionally deselect attacker here if desired:
            // setSelectedAttacker(null);
         }
      }
    },
    [selectedAttacker, heroRoster, enemyRoster, _resolveCombat] // Dependencies for useCallback
  );

  // Only expose the refactored selectUnit action.
  const actions = { selectUnit };

  return (
    <ActionContext.Provider value={actions}>{children}</ActionContext.Provider>
  );
}
