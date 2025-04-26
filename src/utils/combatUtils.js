/**
 * Rolls for an attack.
 * Special-case: a Knight’s attack always hits (true strike).
 * Otherwise, if Math.random() is less than attacker.atk, the attack lands.
 */
export const rollAttack = (attacker) => {
  if (attacker.id === "Knight") {
    return true; // True Strike: always hit.
  }
  return Math.random() < attacker.atk;
};

/**
 * Determines the effective defense stat for a unit.
 * If the defender is in the back row, borrow the def stat from one of the front-row units.
 * If more than one unit is available in front, you can choose the one with the highest def.
 */
export const getEffectiveDefense = (defender, teamRoster) => {
  if (defender.placement === "front") {
    return { effectiveDef: defender.def, provider: defender };
  }
  // For back row, check the front:
  if (teamRoster.front.length > 0) {
    // Choose the unit with the highest defense among the front units.
    const provider = teamRoster.front.reduce((prev, curr) =>
      prev.def > curr.def ? prev : curr
    );
    return { effectiveDef: provider.def, provider };
  }
  // Fallback: if no front row exists, use the defender's own def.
  return { effectiveDef: defender.def, provider: defender };
};

/**
 * Rolls for defense success.
 * If Math.random() is less than the effective defense stat, the defense is successful.
 */
export const rollDefense = (effectiveDef) => {
  return Math.random() < effectiveDef;
};

/**
 * Rolls for a strike back based on the defender's atk stat.
 */
export const rollStrikeBack = (defender) => {
  return Math.random() < defender.atk;
};

/**
 * Applies a successful hit by reducing the atk and def stats of the targeted unit (or its provider).
 * Returns the outcome of the hit.
 */
export const applyHit = (defender, provider) => {
  provider.atk = Math.max(0, provider.atk - 0.1);
  provider.def = Math.max(0, provider.def - 0.1);
  return { outcome: "hit" };
};

/**
 * Simulates a full engagement: attacker vs. defender.
 * Combines attack roll, defense roll, and, if applicable, strike back logic.
 * teamRoster is the full roster (from the defender's side) and is used for determining effective defense.
 */
export const simulateEngagement = (attacker, defender, teamRoster) => {
  // Attack phase:
  if (!rollAttack(attacker)) {
    return { outcome: "miss" };
  }

  // Determine defender's effective defense.
  const { effectiveDef, provider } = getEffectiveDefense(defender, teamRoster);

  // Defense phase:
  if (rollDefense(effectiveDef)) {
    // If defense is successful, check for strike-back chance.
    if (rollStrikeBack(defender)) {
      // For strike back, roles are reversed.
      const strikeBackOutcome = simulateEngagement(
        defender,
        attacker,
        teamRoster
      );
      return { outcome: "defended", strikeBack: strikeBackOutcome };
    }
    return { outcome: "defended" };
  }

  // Attack hits.
  return applyHit(defender, provider);
};
