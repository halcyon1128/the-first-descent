// NEW combatUtils.js
import units from '../data/units.json'

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

export const handleCombat = (
  attacker,
  defender,
  heroRoster,
  enemyRoster,
  setHeroRoster,
  setEnemyRoster
) => {
  const newDefender = defender
  const newAttacker = attacker
  // console.log('attacker: ', attacker)
  // console.log('defender: ', defender)

  //UPDATES PlayerContext Rosters for Re-rendering
  const finalizeAction = (targetToUpdate, updatedTarget) => {
    const isNowHero = updatedTarget.team === 'hero'
    const updateCurrent = isNowHero ? setHeroRoster : setEnemyRoster
    const updateOther = isNowHero ? setEnemyRoster : setHeroRoster

    updateCurrent(currentRoster => {
      const exists = currentRoster.some(unit => unit.id === updatedTarget.id)
      let newRoster
      if (exists) {
        newRoster = currentRoster.map(unit =>
          unit.id === updatedTarget.id ? updatedTarget : unit
        )
      } else {
        // Unit wasn't in this roster, so add it
        const newUnit = { ...updatedTarget }
        newRoster = [...currentRoster, newUnit]
      }
      // console.log(`[${updatedTarget.team}] newRoster:`, newRoster)
      return newRoster
    })
    // Remove unit from the other roster if it's still there
    updateOther(currentRoster => {
      const newRoster = currentRoster.filter(
        unit => unit.id !== updatedTarget.id
      )
      return newRoster
    })
  }

  const teamRoster = unit => (unit.team === 'hero' ? heroRoster : enemyRoster)

  // Necromancer handler
  function getRevivedUnit (defender, units) {
    const revivedUnits = {
      Paladin: 'Revenant',
      Knight: 'Revenant',
      Assassin: 'Revenant',
      Priest: 'Skeleton_Mage',
      Warlock: 'Skeleton_Mage',
      Mage: 'Skeleton_Mage',
      Skeleton_Mage: 'Skeleton_Mage',
      Ranger: 'Skeleton_Archer',
      Skeleton_Archer: 'Skeleton_Archer',
      Bard: 'Wraith',
      Wraith: 'Wraith',
      Orc: 'Wraith'
    }

    // Default to 'Revived' if no specific unit is found
    const unitType = revivedUnits[defender.type] || 'Revived'

    // Find the unit to revive
    const unitToRevive = units.find(u => u.type === unitType)

    // Initialize revived unit attributes
    return {
      ...unitToRevive,
      team: 'hero',
      row: 'front',
      id: defender.id
    }
  }
  // isKilled handler
  if (
    (attacker.status === 'killed' || defender.status === 'killed') &&
    attacker.type !== 'Necromancer'
  ) {
    console.warn('Invalid combat: Attacker or defender is missing or killed.')
    return { outcome: 'invalid' }
  }

  switch (true) {
    //ranged-class
    case attacker.row === 'back' &&
      attacker.type !== 'Ranger' &&
      attacker.type !== 'Warlock' &&
      attacker.type !== 'Assassin' &&
      attacker.type !== 'Skeleton_Archer' &&
      attacker.type !== 'Wyvern' &&
      attacker.type !== 'Skeleton_Mage' &&
      attacker.type !== 'Goblin' &&
      attacker.type !== 'Wraith' &&
      attacker.type !== 'Priest' &&
      attacker.type !== 'Mage' &&
      attacker.type !== 'Necromancer':
      return console.log('target out of range!')
    //sniper-class
    case defender.row === 'back' &&
      attacker.type !== 'Ranger' &&
      attacker.type !== 'Warlock' &&
      attacker.type !== 'Assassin' &&
      attacker.type !== 'Skeleton_Archer' &&
      attacker.type !== 'Wyvern' &&
      attacker.type !== 'Revenant' &&
      attacker.type !== 'Necromancer' &&
      teamRoster(defender).filter(
        u => u.row === 'front' && u.status !== 'killed'
      ).length >=
        teamRoster(defender).filter(
          u => u.row === 'back' && u.status !== 'killed'
        ).length:
      return console.log('target is well-defended')
    // NECROMANCY
    case attacker.type === 'Necromancer' && defender.status === 'killed':
      const _Revenant = units.find(u => u.type === 'Revenant')
      let _SkeletonMage = units.find(u => u.type === 'Skeleton_Mage')
      let _SkeletonArcher = units.find(u => u.type === 'Skeleton_Archer')
      let _Wraith = units.find(u => u.type === 'Wraith')
      let _Revived = units.find(u => u.type === 'Revived')
      if (
        newDefender.type === 'Paladin' ||
        newDefender.type === 'Knight' ||
        newDefender.type === 'Assassin'
      ) {
        _Revenant.team = 'hero'
        _Revenant.row = 'front'
        _Revenant.id = defender.id
        Object.assign(newDefender, _Revenant)
      } else if (
        newDefender.type === 'Priest' ||
        newDefender.type === 'Warlock' ||
        newDefender.type === 'Mage' ||
        newDefender.type === 'Skeleton_Mage'
      ) {
        _SkeletonMage.team = 'hero'
        _SkeletonMage.row = 'front'
        _SkeletonMage.id = defender.id
        Object.assign(newDefender, _SkeletonMage)
      } else if (
        newDefender.type === 'Ranger' ||
        newDefender.type === 'Skeleton_Archer'
      ) {
        _SkeletonArcher.team = 'hero'
        _SkeletonArcher.row = 'front'
        _SkeletonArcher.id = defender.id
        Object.assign(newDefender, _SkeletonArcher)
      } else if (
        newDefender.type === 'Bard' ||
        newDefender.type === 'Wraith' ||
        newDefender.type === 'Orc'
      ) {
        _Wraith.team = 'hero'
        _Wraith.row = 'front'
        _Wraith.id = defender.id
        Object.assign(newDefender, _Wraith)
      } else {
        _Revived.team = 'hero'
        _Revived.row = 'front'
        _Revived.id = defender.id
        Object.assign(newDefender, _Revived)
      }
      return finalizeAction(defender, newDefender)
    //HEAL
    case attacker.team === defender.team &&
      attacker.type === 'Priest' &&
      attacker.type !== 'Necromancer':
      // console.log('defender.maxHp: ', defender.maxHp)
      newDefender.hp = newDefender.maxHp
      newDefender.status = 'healthy'
      return finalizeAction(defender, newDefender)

    //BUFF
    case attacker.team === defender.team && attacker.type === 'Bard':
      let buff =
        getRandom() > 0.3 ? (newDefender.def += 0.3) : (newDefender.atk += 0.5)
      return finalizeAction(defender, newDefender)

    //friendly-fire handler
    case attacker.team === defender.team && attacker.type !== 'Necromancer':
      return console.log('cannot attack teammates!')

    //DEBUFF
    case attacker.team !== defender.team &&
      (attacker.type === 'Warlock' ||
        attacker.type === 'Skeleton_Mage' ||
        attacker.type === 'Mage'):
      let debuff = getRandom() > 0.5 ? 'maimed' : 'paralyzed'

      if (rollAttack(attacker.atk) === false && defender.status !== 'killed') {
        newDefender.status = debuff
        debuff === 'maimed'
          ? (newDefender.def -= 0.5)
          : (newDefender.atk -= 0.5)
        return finalizeAction(defender, newDefender)
      }
      if (rollDefend(defender.def) === true && defender.status !== 'killed') {
        newDefender.status = debuff
        debuff === 'maimed'
          ? (newDefender.def -= 0.5)
          : (newDefender.atk -= 0.5)
        return finalizeAction(defender, newDefender)
      }
      newDefender.hp -= 1
      if (newDefender.hp === 0) {
        newDefender.status = 'killed'
        newDefender.def = 0
        newDefender.atk = 0
      }
      return finalizeAction(defender, newDefender)

    //default combat

    default:
      // console.log('attacker.atk -->', attacker.atk)
      if (rollAttack(attacker.atk) === false) {
        return console.log(attacker.id, `(${attacker.type})`, ' missed!')
      }
      if (rollDefend(defender.def) === true) {
        return console.log(
          defender.id,
          `(${defender.type})`,
          ' deflected the attack!'
        )
      }
      newDefender.hp -= 1
      if (newDefender.hp === 0) {
        newDefender.status = 'killed'
        newDefender.def = 0
        newDefender.atk = 0
      }
      return finalizeAction(defender, newDefender)
  }
}

// Additional utility functions for ActionContext
export const isValidCombatPair = (attacker, defender) => {
  // Check if both units exist and neither is killed
  if (!attacker || !defender) return false
  if (
    (attacker.status === 'killed' || defender.status === 'killed') &&
    attacker.type !== 'Necromancer'
  )
    return false
  return true
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
