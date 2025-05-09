import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import { useCombatTracking } from '../contexts/CombatTrackingContext'
import Card from './Card'
import { useContext } from 'preact/hooks'
import { PlayerContext } from '../contexts/PlayerContext'
import { ActionContext } from '../contexts/ActionContext'
import Modal from './Modal' // Import Modal
import { ModalContext } from '../contexts/ModalContext' // Import ModalContext

export default function GameBoard () {
  const { heroRoster, enemyRoster } = useContext(PlayerContext)
  // Removed setActionCount from here as it's not used directly in this component anymore for reset
  const { selectedAttacker, selectedDefender, resetSelection } =
    useContext(ActionContext) // Import resetSelection
  const { openModal } = useContext(ModalContext) // Get openModal from ModalContext

  const filterByRow = (roster, row) => roster.filter(unit => unit.row === row)

  const enemyBackRow = filterByRow(enemyRoster, 'back')
  const enemyFrontRow = filterByRow(enemyRoster, 'front')
  const heroFrontRow = filterByRow(heroRoster, 'front')
  const heroBackRow = filterByRow(heroRoster, 'back')

  // Detect clicks outside of cards to reset selections ONLY
  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [selectedAttacker, selectedDefender, resetSelection]) // Add resetSelection to dependencies

  const handleOutsideClick = event => {
    // Only reset if an attacker is selected but not a defender yet
    if (
      !event.target.closest('.card') &&
      selectedAttacker &&
      !selectedDefender
    ) {
      console.log('Outside click detected, resetting selection.')
      resetSelection() // Use the reset function from ActionContext
      // DO NOT reset actionCount here - turn switching is handled by EnemyBoard
    }
  }

  return (
    <div class='h-screen w-screen bg-gray-900 flex flex-col items-center justify-center py-2 text-xs md:text-lg lg:text-lg'>
      <Modal /> {/* Add Modal component here */}
      <div class='flex flex-row gap-2 justify-center min-h-[120px] items-center'>
        {enemyBackRow.map(unit => (
          <Card {...unit} key={unit.id} className='card' /> // Added key prop
        ))}
      </div>
      <div class='flex flex-row gap-2 mt-2 justify-center min-h-[120px] items-center'>
        {enemyFrontRow.map(unit => (
          <Card {...unit} key={unit.id} className='card' /> // Added key prop
        ))}
      </div>

      <div class='h-16'></div>

      <div class='flex flex-row gap-2 mt-2 justify-center min-h-[120px] items-center'>
        {heroFrontRow.map(unit => (
          <Card {...unit} key={unit.id} className='card' /> // Added key prop
        ))}
      </div>
      <div class='flex flex-row gap-2 mt-2 justify-center min-h-[120px] items-center'>
        {heroBackRow.map(unit => (
          <Card {...unit} key={unit.id} className='card' /> // Added key prop
        ))}
      </div>
      <div class='absolute top-4 left-4 bg-red-600 text-white p-2 rounded shadow-lg z-10'>
        Player Turn...
      </div>
    </div> 
  )
}
