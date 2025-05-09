// Card.jsx
import { h } from 'preact'
import { useContext, useLayoutEffect, useState } from 'preact/hooks'
import { ActionContext } from '../contexts/ActionContext'
import { useEffect } from 'react'
// Removed useCombatTracking import as trackAction is no longer needed here

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

  const [nameColor, setNameColor] = useState('')
  const [isKilled, setIsKilled] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [playerTurn, setPlayerTurn] = useState(localStorage.getItem('playerTurn'))
  const [cardClasses, setCardClasses] = useState(
    'font-mono py-4 border border-gray-700 bg-gray-800 rounded-lg shadow-md flex flex-col focus:outline-none selection:bg-transparent w-40'
  )

console.log('cardClasses: ', cardClasses)
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

  useEffect(() => {
    setNameColor(team === 'enemy' ? 'text-rose-400' : 'text-teal-200')
    setIsKilled(status === 'killed')
    setIsSelected(selectedAttacker?.id === id || selectedDefender?.id === id)
    if(necromancerSelected && !isKilled && type !== 'Necromancer'){
      setCardClasses(cardClasses + ' collapse')
    } else if (isSelected && !isKilled) {
      setCardClasses(cardClasses + ' border-yellow-400 border-2')
    }
    else if (isKilled && !necromancerSelected) {
      setCardClasses(cardClasses + ' opacity-50 cursor-not-allowed')
    }
    else if (!isKilled && !necromancerSelected) {
      setCardClasses(cardClasses + ' hover:bg-slate-600')
    }
    else {
      setCardClasses(cardClasses + ' hover:bg-slate-600')
    }
  }, [team, status, type, isKilled, necromancerSelected, selectedAttacker, selectedDefender, cardClasses])

  const isDisabled = () => { 
  switch(true) {  
    case (team === 'enemy' && !selectedAttacker) || (isKilled && !necromancerSelected):
    return  true
   default:
    return false
  }
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

  
  
  return (
    <button
      onClick={() =>handleClick()}
      disabled={isDisabled()}
      
      {...enemyAttributes}
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
