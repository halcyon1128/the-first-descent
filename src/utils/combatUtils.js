function getRandom(msecs, myRand) {
  msecs = new Date().getMilliseconds();
  myRand = Math.floor(((msecs * Math.random()) % 101));
  return myRand;
}

export const rollAttack = (attackerAtk) => {
  const attackThreshold = Math.floor(attackerAtk * 100);
  const roll = getRandom();
  return roll < attackThreshold;
};

export const rollDefend = (defenderDef) => {
  const defendThreshold = Math.floor(defenderDef * 100);
  const roll = getRandom();
  return roll < defendThreshold;
};

export const updateTarget = (target, damage = 1) => {
  const newHp = Math.max(target.hp - damage, 0);
  let newStatus = target.status;

  if (newHp <= 0) {
    newStatus = "killed";
  }

  return {
    ...target,
    hp: newHp,
    status: newStatus,
  };
};

export const handleCombat = (attacker, defender, setHeroRoster, setEnemyRoster) => {
  if (!attacker || !defender || attacker.status === 'killed' || defender.status === 'killed') {
    console.warn("Invalid combat: Attacker or defender is missing or killed.");
    return { outcome: "invalid" };
  }

  console.log(`Combat Initiated: ${attacker.type} ${attacker.id} vs ${defender.type} ${defender.id}`);

  if (!rollAttack(attacker.atk)) {
    console.log(`${attacker.type} ${attacker.id} missed ${defender.type} ${defender.id}.`);
    return { outcome: "miss" };
  }

  console.log(`${attacker.type} ${attacker.id}'s attack roll succeeded.`);

  if (rollDefend(defender.def)) {
    console.log(`${defender.type} ${defender.id} deflected the attack.`);
    return { outcome: "defended" };
  }

  console.log(`${defender.type} ${defender.id}'s defense roll failed; damage goes through.`);

  const updatedDefender = updateTarget(defender);
  console.log(`${defender.type} ${defender.id} takes 1 damage. HP: ${updatedDefender.hp}, Status: ${updatedDefender.status}`);

  const rosterSetter = defender.team === 'hero' ? setHeroRoster : setEnemyRoster;
  rosterSetter((prevRoster) =>
    prevRoster.map((unit) =>
      unit.id === defender.id ? updatedDefender : unit
    )
  );

  console.log(`${defender.team === 'hero' ? 'Hero' : 'Enemy'} roster updated.`);

  return { outcome: "hit" };
};
