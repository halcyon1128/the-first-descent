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

  // Normally, killed cards get opacity and not-allowed cursor.
  // However, if necromancerSelected is true, even killed cards remain clickable.
  if (isKilled && !necromancerSelected) {
    cardClasses += ' opacity-50 cursor-not-allowed'
  } else {
    cardClasses += ' hover:bg-slate-600'
  }

  if (isSelected && !isKilled) {
    cardClasses += ' border-yellow-400 border-2'
  }

  // Determine disabled state: if killed and no necromancer is selected, we disable.
  const isDisabled = isKilled && !necromancerSelected

  return (
    <button
      onClick={
        !isDisabled
          ? () =>
              selectUnit({ id, type, hp, maxHp, row, atk, def, status, team })
          : undefined
      }
      disabled={isDisabled}
      class={cardClasses}
    >
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
      {/* <div class='invisible text-xxs p-0 m-0'>{atk}</div> */}
      {/* <div class='invisible text-xxs p-0 m-0'>{def}</div> */}
    </button>
  )
}
