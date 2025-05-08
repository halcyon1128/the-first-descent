import { h } from 'preact'
import { useEffect, useContext, useState } from 'preact/hooks' // useState is no longer strictly needed here but keeping for selectedEnemyId/selectedHeroId
import { useCombatTracking } from '../contexts/CombatTrackingContext'
import Card from './Card'
import { PlayerContext } from '../contexts/PlayerContext'
import { ActionContext } from '../contexts/ActionContext'
import Modal from './Modal' // Import Modal
import { ModalContext } from '../contexts/ModalContext' // Import ModalContext

export default function EnemyBoard () {
  const { heroRoster, enemyRoster } = useContext(PlayerContext)
  const { setIsPlayerTurn } = useCombatTracking()
  const { executeCombat } = useContext(ActionContext)
  const { openModal } = useContext(ModalContext) // Get openModal

  // State for UI highlighting of the selected enemy and hero
  const [selectedEnemyId, setSelectedEnemyId] = useState(null)
  const [selectedHeroId, setSelectedHeroId] = useState(null)

  // --- Enemy AI Logic with staggered selections ---
  useEffect(() => {
    console.log('EnemyBoard: Mounted, initiating enemy turn...')

    let enemySelectTimer, heroSelectTimer, executeTimer

    // No need to set isInputDisabled here anymore

    enemySelectTimer = setTimeout(() => {
      const livingEnemies = enemyRoster.filter(unit => unit.status !== 'killed')
      const livingHeroes = heroRoster.filter(unit => unit.status !== 'killed')

      if (livingEnemies.length > 0 && livingHeroes.length > 0) {
        const chosenAttacker =
          livingEnemies[Math.floor(Math.random() * livingEnemies.length)]

        console.log(
          `Enemy AI: Selected attacker ${chosenAttacker.id} (${chosenAttacker.type})`
        )
        setSelectedEnemyId(chosenAttacker.id)

        heroSelectTimer = setTimeout(() => {
          const chosenDefender =
            livingHeroes[Math.floor(Math.random() * livingHeroes.length)]

          console.log(
            `Enemy AI: Selected defender ${chosenDefender.id} (${chosenDefender.type})`
          )
          setSelectedHeroId(chosenDefender.id)

          executeTimer = setTimeout(() => {
            executeCombat(chosenAttacker, chosenDefender)
            setSelectedEnemyId(null)
            setSelectedHeroId(null)
            setIsPlayerTurn(true) // Switch back to player
            // No need to set isInputDisabled here anymore
            console.log(
              'Enemy AI: Turn complete, switching back to player turn.'
            )
          }, 1000)
        }, 1000)
      } else {
        console.log('Enemy AI: No valid targets or attackers available.')
        setIsPlayerTurn(true) // Switch back to player
        // No need to set isInputDisabled here anymore
      }
    }, 500)

    return () => {
      clearTimeout(enemySelectTimer)
      clearTimeout(heroSelectTimer)
      clearTimeout(executeTimer)
      // No need to manage isInputDisabled on unmount related to AI logic
    }
  }, []) // This effect runs once on mount to control the AI turn

  // --- Effect for PERMANENTLY disabling keyboard and context menu while component is mounted ---
  useEffect(() => {
    const preventDefaultActions = (event) => {
      event.preventDefault()
    }

    // Disable keyboard events and context menu
    window.addEventListener('keydown', preventDefaultActions, true)
    window.addEventListener('keyup', preventDefaultActions, true)
    window.addEventListener('contextmenu', preventDefaultActions, true)

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      window.removeEventListener('keydown', preventDefaultActions, true)
      window.removeEventListener('keyup', preventDefaultActions, true)
      window.removeEventListener('contextmenu', preventDefaultActions, true)
      console.log('EnemyBoard: Unmounted, input disabling listeners removed.')
    }
  }, []) // Empty dependency array means this runs once on mount and cleanup on unmount

  const filterByRow = (roster, row) => roster.filter(unit => unit.row === row)

  const enemyBackRow = filterByRow(enemyRoster, 'back')
  const enemyFrontRow = filterByRow(enemyRoster, 'front')
  const heroFrontRow = filterByRow(heroRoster, 'front')
  const heroBackRow = filterByRow(heroRoster, 'back')

  return (
    <div class='h-screen w-screen bg-gray-900 flex flex-col items-center justify-center py-2 text-xs md:text-lg lg:text-lg relative'>
      <Modal /> {/* Add Modal component here */}
      {/* PERMANENT Input Disabler Overlay for this component */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'transparent', // Keeps it invisible
          zIndex: 100, // High z-index to cover everything
        }}
        // onClick and onContextMenu on the div itself will stop propagation for mouse events
        // that might somehow target it directly, though the window listeners are more global.
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
      />

      {/* Enemy Turn Indicator */}
      {/* Ensure this z-index is lower than the overlay if you want it non-interactive,
          or higher if it must be seen above an opaque overlay (though our overlay is transparent) */}
      <div class='absolute top-4 left-4 bg-red-600 text-white p-2 rounded shadow-lg z-10'>
        Enemy Turn...
      </div>

      {/* Render Enemy Rows */}
      <div class='flex flex-row gap-2 justify-center min-h-[120px] items-center'>
        {enemyBackRow.map(unit => (
          <div
            key={unit.id}
            className={`${
              unit.id === selectedEnemyId ? 'border-2 border-yellow-600' : ''
            }`}
          >
            <Card {...unit} className='card' />
          </div>
        ))}
      </div>
      <div class='flex flex-row gap-2 mt-2 justify-center min-h-[120px] items-center'>
        {enemyFrontRow.map(unit => (
          <div
            key={unit.id}
            className={`${
              unit.id === selectedEnemyId ? 'border-2 border-yellow-600' : ''
            }`}
          >
            <Card {...unit} className='card' />
          </div>
        ))}
      </div>

      <div class='h-16'></div>

      {/* Render Hero Rows (presumably for display only) */}
      <div class='flex flex-row gap-2 mt-2 justify-center min-h-[120px] items-center'>
        {heroFrontRow.map(unit => (
          <div
            key={unit.id}
            className={`${
              unit.id === selectedHeroId ? 'border-2 border-rose-600' : '' // Highlight for AI targeting
            }`}
          >
            <Card {...unit} className='card' />
          </div>
        ))}
      </div>
      <div class='flex flex-row gap-2 mt-2 justify-center min-h-[120px] items-center'>
        {heroBackRow.map(unit => (
          <div
            key={unit.id}
            className={`${
              unit.id === selectedHeroId ? 'border-2 border-rose-600' : '' // Highlight for AI targeting
            }`}
          >
            <Card {...unit} className='card' />
          </div>
        ))}
      </div>
    </div>
  )
}
