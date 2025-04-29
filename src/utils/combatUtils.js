/**
 * generate Random number
 * for use in attacking, defending and counter attacking phases
 * combatUtils scoped only
 */
function getRandom(msecs, myRand) {
  msecs = new Date().getMilliseconds();
  myRand = Math.round((msecs + Math.random()) / 10);
  return myRand;
}

/**
 * Rolls for an attack.
 * Special-case: a Knight’s attack always hits (true strike).
 * Otherwise, if Math.random() is less than attacker.atk, the attack lands.
 */
export const rollAttack = (attackerAtk, hit) => {
  attackerAtk *= 100;
  console.log(`attackerAtk = ${attackerAtk}`);
  if (attackerAtk > getRandom()) {
    hit = true;
    console.log("hit!");
  } else {
    hit = false;
    console.log("miss!");
  }

  return hit;
};

/**
 * Rolls for a defend.
 *
 */
export const rollDefend = (defenderDef, deflect) => {
  defenderDef *= 100;
  console.log(`defenderDef = ${defenderDef}`);
  if (defenderDef > getRandom()) {
    deflect = true;
    console.log("attack deflected!");
  } else {
    deflect = false;
    console.log(`target is hit!`);
  }
  return deflect;
};

/**
 * Decrease the target's HP by 1.
 * If HP drops to 0 or below, set status to 'killed'.
 * Otherwise, update status based on HP percentage (e.g., 'wounded' - placeholder for now).
 */
export const updateTarget = (target) => {
  const newHp = Math.max(target.hp - 1, 0); // Ensure HP doesn't go below 0
  let newStatus = target.status; // Start with current status

  if (newHp <= 0) {
    newStatus = "killed"; // Set status to killed if HP is 0 or less
  }
  // Placeholder for other status updates like 'wounded'
  // else if (newHp === 1 && target.maxHp > 1) {
  //   newStatus = "wounded";
  // }
  // else {
  //    newStatus = "healthy"; // Or revert to healthy if conditions met
  // }

  return {
    ...target,
    hp: newHp,
    status: newStatus, // Update status along with HP
  };
};
