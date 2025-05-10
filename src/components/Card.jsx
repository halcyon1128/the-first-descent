// Card.jsx
// Card.jsx
import { h } from 'preact'
import { useContext, useLayoutEffect } from 'preact/hooks'
import { ActionContext } from '../contexts/ActionContext'

export default function Card ({
  id,
  type,
  hp,
  maxHp,
  row,
  atk,
  def,
  status,
  team
}) {
  const { selectUnit, selectedAttacker, selectedDefender } =
    useContext(ActionContext)
  // Removed trackAction destructuring

  // Determine the color for the type name based on team.
  const nameColor = team === 'enemy' ? 'text-rose-400' : 'text-teal-200'
  const isKilled = status === 'killed'
  const isSelected = selectedAttacker?.id === id || selectedDefender?.id === id

  // Derive whether a necromancer is currently selected from context
  const necromancerSelected =
    selectedAttacker?.type === 'Necromancer' ||
    selectedDefender?.type === 'Necromancer'

  // Update localStorage synchronously before paint if the necromancer selection changes.
  useLayoutEffect(() => {
    localStorage.setItem(
      'necromancerSelected',
      necromancerSelected ? 'true' : 'false'
    )
  }, [necromancerSelected])

  let cardClasses =
    'font-mono py-4 border border-gray-700 bg-gray-800 rounded-lg shadow-md flex flex-col focus:outline-none selection:bg-transparent w-40'

  switch (true) {
    case !selectedAttacker && team === 'enemy':
      cardClasses += ' opacity-50 cursor-not-allowed'
      break
    case necromancerSelected && !isKilled && type !== 'Necromancer':
      cardClasses += ' collapse'
      break
    case isSelected && !isKilled:
      cardClasses += ' border-yellow-400 border-2'
      break
    case isKilled && !necromancerSelected:
      cardClasses += ' opacity-50 cursor-not-allowed'
      break
    case !isKilled && !necromancerSelected:
      cardClasses += ' hover:bg-slate-600'
      break
    default:
      cardClasses += ' hover:bg-slate-600'
      break
  }

  function isDisabled () {
    if (
      (isKilled && !necromancerSelected) ||
      (team === 'enemy' && !selectedAttacker)
    ) {
      return true
    }
    return false
  }

  function handleClick () {
    selectUnit({ id, type, hp, maxHp, row, atk, def, status, team })
    // trackAction() // Removed call to trackAction
    return
  }

  // Add a class and data attribute if this is an enemy card.
  const enemyAttributes =
    team === 'enemy'
      ? {
          className: `${cardClasses} enemy-card`,
          'data-hp': isKilled ? '0' : hp
        }
      : { className: cardClasses }

  console.log('selectedAttacker--->', selectedAttacker)

  return (
    <button onClick={handleClick} disabled={isDisabled()} {...enemyAttributes}>
      <div class='font-serif font-thin text-gray-300'>{id}</div>
      <div class={`font-semibold text-xxs mb-2 ${nameColor}`}>{type}</div>
      <div class='text-green-400 font-semibold text-xxs'>
        {isKilled ? 0 : hp} hp
      </div>
      <div
        class={isKilled ? 'text-gray-500 text-xxs' : 'text-red-400 text-xxs'}
      >
        {status}
      </div>
    </button>
  )
}
