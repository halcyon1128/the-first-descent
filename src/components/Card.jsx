import { h } from 'preact'
import { useContext } from 'preact/hooks'
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

  let cardClasses =
    'font-mono py-4 border border-gray-700 bg-gray-800 rounded-lg shadow-md flex flex-col focus:outline-none selection:bg-transparent w-40'

  if (isKilled) {
    cardClasses += ' opacity-50 cursor-not-allowed'
  } else {
    cardClasses += ' hover:bg-slate-600'
  }

  if (isSelected && !isKilled) {
    cardClasses += ' border-yellow-400 border-2'
  }

  return (
    <button
      onClick={
        !isKilled
          ? () =>
              selectUnit({ id, type, hp, maxHp, row, atk, def, status, team })
          : undefined
      }
      disabled={isKilled}
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
    </button>
  )
}
