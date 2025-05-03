export const updateDebuff = (target, debuff) => {
  let newStatus = target.status
  if (debuff === 'paralyzed') {
    newStatus = debuff
    return {
      ...target,
      def: 0,
      status: newStatus
    }
  }
  if (debuff === 'maimed') {
    return {
      ...target,
      atk: 0,
      status: newStatus
    }
  }
}

export const heal = (target, template) => {
  const unitType = target.type
  const baseStats = template[unitType]
  if (!baseStats) {
    console.warn(`No template found for unit type: ${unitType}`)
    return { ...target }
  }
  return {
    ...target,
    hp: baseStats.hp,
    atk: baseStats.atk,
    def: baseStats.def,
    status: 'normal' // optionally clear status
  }
}
