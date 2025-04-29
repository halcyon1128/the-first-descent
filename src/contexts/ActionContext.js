import { createContext } from "preact";
import { useState, useContext, useCallback } from "preact/hooks";
import { PlayerContext } from "./PlayerContext";
import { handleCombat } from "../utils/combatUtils";

export const ActionContext = createContext();

export function ActionProvider({ children }) {
  const { heroRoster, enemyRoster, setHeroRoster, setEnemyRoster } = useContext(PlayerContext);
  const [selectedAttacker, setSelectedAttacker] = useState(null);

  const selectUnit = useCallback(
    (unit) => {
      console.log("selectUnit called with:", unit);

      if (unit.team === "hero") {
        const currentHeroState = heroRoster.find((u) => u.id === unit.id);
        if (!currentHeroState) {
          console.error("Hero unit not found in roster:", unit.id);
          return;
        }

        if (currentHeroState.status === 'killed') {
          console.log(`${currentHeroState.type} ${currentHeroState.id} is killed and cannot attack.`);
          return;
        }

        if (selectedAttacker && selectedAttacker.id === currentHeroState.id) {
           console.log(`Deselected attacker: ${currentHeroState.type} ${currentHeroState.id}`);
           setSelectedAttacker(null);
        }
        else if (selectedAttacker && selectedAttacker.id !== currentHeroState.id) {
            console.log(`Switched attacker to: ${currentHeroState.type} ${currentHeroState.id}`);
            setSelectedAttacker(currentHeroState);
        }
        else {
           console.log(`Selected attacker: ${currentHeroState.type} ${currentHeroState.id}`);
           setSelectedAttacker(currentHeroState);
        }

      } else if (unit.team === "enemy") {
        if (selectedAttacker) {
          const currentEnemyState = enemyRoster.find((u) => u.id === unit.id);
          if (!currentEnemyState) {
            console.error("Enemy unit not found in roster:", unit.id);
            return;
          }

          if (currentEnemyState.status === 'killed') {
            console.log(`${currentEnemyState.type} ${currentEnemyState.id} is already killed.`);
            return;
          }

          console.log(`Selected target: ${currentEnemyState.type} ${currentEnemyState.id}`);

          handleCombat(selectedAttacker, currentEnemyState, setHeroRoster, setEnemyRoster);

          setSelectedAttacker(null);

        } else {
          console.warn("Please select a hero attacker first.");
        }
      }
    },
    [selectedAttacker, heroRoster, enemyRoster, setHeroRoster, setEnemyRoster]
  );

  const contextValue = { selectedAttacker, selectUnit };

  return (
    <ActionContext.Provider value={contextValue}>{children}</ActionContext.Provider>
  );
}
