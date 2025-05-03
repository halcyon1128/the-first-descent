function getRandom (msecs, myRand) {
  msecs = new Date().getMilliseconds()
  myRand = Math.floor((msecs * Math.random()) % 101)
  return myRand
}

export const rollAttack = attackerAtk => {
  const attackThreshold = Math.floor(attackerAtk * 100)
  const roll = getRandom()
  return roll < attackThreshold
}

export const rollDefend = defenderDef => {
  const defendThreshold = Math.floor(defenderDef * 100)
  const roll = getRandom()
  return roll < defendThreshold
}

export const updateTarget = (target, damage = 1) => {
  const newHp = target.hp - damage
  let newStatus = target.status
  if (newHp <= 0) {
    newStatus = 'killed'
  }
  return {
    ...target,
    hp: newHp,
    status: newStatus
  }
}

export const handleCombat = (
  attacker,
  defender,
  heroRoster,
  enemyRoster,
  setHeroRoster,
  setEnemyRoster
) => {
  // console.log('REPORT attacker:')
  // console.log(attacker)
  // console.log('REPORT defender:')
  // console.log(defender)
  if (
    !attacker ||
    !defender ||
    attacker.status === 'killed' ||
    defender.status === 'killed'
  ) {
    console.warn('Invalid combat: Attacker or defender is missing or killed.')
    return { outcome: 'invalid' }
  }

  console.log(
    `Combat Initiated: ${attacker.type} ${attacker.id} vs ${defender.type} ${defender.id}`
  )

  if (!rollAttack(attacker.atk)) {
    console.log(
      `${attacker.type} ${attacker.id} missed ${defender.type} ${defender.id}.`
    )
    return { outcome: 'miss' }
  }

  console.log(`${attacker.type} ${attacker.id}'s attack roll succeeded.`)

  if (rollDefend(defender.def)) {
    console.log(`${defender.type} ${defender.id} deflected the attack.`)
    return { outcome: 'defended' }
  }

  console.log(
    `${defender.type} ${defender.id}'s defense roll failed; damage goes through.`
  )

  const updatedDefender = updateTarget(defender)
  console.log(
    `${defender.type} ${defender.id} takes 1 damage. HP: ${updatedDefender.hp}, Status: ${updatedDefender.status}`
  )

  // Update the appropriate roster based on the defender's team
  if (defender.team === 'hero') {
    setHeroRoster(
      heroRoster.map(unit => (unit.id === defender.id ? updatedDefender : unit))
    )
    console.log('Hero roster updated.')
  } else if (defender.team === 'enemy') {
    let ner = enemyRoster.map(unit =>
      unit.id === defender.id ? updatedDefender : unit
    )
    console.log('Enemy roster updated, ', ner)

    setEnemyRoster(ner)
  } else {
    console.error('Unknown team type:', defender.team)
  }

  return { outcome: 'hit' }
}

// Additional utility functions for ActionContext
export const isValidCombatPair = (attacker, defender) => {
  // Check if both units exist and neither is killed
  if (!attacker || !defender) return false
  if (attacker.status === 'killed' || defender.status === 'killed') return false

  // Check if they're on different teams
  return attacker.team !== defender.team
}

export const processCombat = (
  attacker,
  defender,
  heroRoster,
  enemyRoster,
  setHeroRoster,
  setEnemyRoster
) => {
  // Validate the combat pair
  if (!isValidCombatPair(attacker, defender)) {
    return { outcome: 'invalid' }
  }

  // Process the combat
  return handleCombat(
    attacker,
    defender,
    heroRoster,
    enemyRoster,
    setHeroRoster,
    setEnemyRoster
  )
}
