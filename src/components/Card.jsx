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

  const nameColor = team === 'enemy' ? 'text-rose-400' : 'text-teal-200'
  const isKilled = status === 'killed'
  const isSelected = selectedAttacker?.id === id || selectedDefender?.id === id
  const isEnemy = team === 'enemy'
  const isBuffer = selectedAttacker
    ? ['Priest', 'Bard'].includes(selectedAttacker.type)
    : false
  const necromancerSelected =
    selectedAttacker?.type === 'Necromancer' ||
    selectedDefender?.type === 'Necromancer'

  useLayoutEffect(() => {
    localStorage.setItem(
      'necromancerSelected',
      necromancerSelected ? 'true' : 'false'
    )
  }, [necromancerSelected])

  let cardClasses =
    'font-mono py-4 border border-gray-700 bg-gray-800 rounded-lg shadow-md flex flex-col focus:outline-none selection:bg-transparent w-40'

  switch (true) {
    case isKilled && !necromancerSelected:
      cardClasses += ' opacity-50 cursor-not-allowed'
      break
    case isSelected && !isKilled:
      cardClasses += ' border-yellow-400 border-2'
      break
    case isEnemy && !selectedAttacker:
      cardClasses += ' opacity-80 cursor-not-allowed'
      break
    case selectedAttacker &&
      !['Priest', 'Bard'].includes(selectedAttacker.type) &&
      !isEnemy:
      cardClasses += ' opacity-80 cursor-not-allowed'
      break
    case necromancerSelected && !isKilled && type !== 'Necromancer':
      cardClasses += ' collapse'
      break
    case isKilled && !necromancerSelected:
      cardClasses += ' opacity-50 cursor-not-allowed'
      break
    default:
      cardClasses += ' hover:bg-slate-600'
      break
  }

  console.log('HAYOP_KA')
  function isDisabled () {
    if (
      (selectedAttacker !== null && !isBuffer && team === 'hero') ||
      (isKilled && !necromancerSelected) ||
      (isEnemy && !selectedAttacker)
    ) {
      return true
    } else {
      return false
    }
  }

  function handleClick () {
    if (!isDisabled()) {
      selectUnit({ id, type, hp, maxHp, row, atk, def, status, team })
    }
  }

  const enemyAttributes = isEnemy
    ? {
        className: `${cardClasses} enemy-card`,
        'data-hp': isKilled ? '0' : hp
      }
    : { className: cardClasses }

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
