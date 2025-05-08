import { h } from 'preact'
import { useEffect, useContext, useState } from 'preact/hooks'
import { useCombatTracking } from '../contexts/CombatTrackingContext'
import Card from './Card'
import { PlayerContext } from '../contexts/PlayerContext'
import { ActionContext } from '../contexts/ActionContext'

export default function EnemyBoard () {
  const { heroRoster, enemyRoster } = useContext(PlayerContext)
  const { setIsPlayerTurn } = useCombatTracking() // Get setIsPlayerTurn, remove actionCount/resetAction
  const { executeCombat } = useContext(ActionContext)

  // New state for UI highlighting of the selected enemy and hero
  const [selectedEnemyId, setSelectedEnemyId] = useState(null)
  const [selectedHeroId, setSelectedHeroId] = useState(null)

  // --- Enemy AI Logic with staggered selections ---
  useEffect(() => {
    console.log('EnemyBoard: Mounted, initiating enemy turn...')

    let enemySelectTimer, heroSelectTimer, executeTimer

    enemySelectTimer = setTimeout(() => {
      // Filter for living units only
      const livingEnemies = enemyRoster.filter(unit => unit.status !== 'killed')
      const livingHeroes = heroRoster.filter(unit => unit.status !== 'killed')

      if (livingEnemies.length > 0 && livingHeroes.length > 0) {
        // Select a random living enemy attacker
        const chosenAttacker =
          livingEnemies[Math.floor(Math.random() * livingEnemies.length)]

        console.log(
          `Enemy AI: Selected attacker ${chosenAttacker.id} (${chosenAttacker.type})`
        )
        // Set enemy highlight immediately
        setSelectedEnemyId(chosenAttacker.id)

        // After a 2-second delay, select a hero defender
        heroSelectTimer = setTimeout(() => {
          const chosenDefender =
            livingHeroes[Math.floor(Math.random() * livingHeroes.length)]

          console.log(
            `Enemy AI: Selected defender ${chosenDefender.id} (${chosenDefender.type})`
          )
          setSelectedHeroId(chosenDefender.id)

          // After an additional 1 second, execute the combat action
          executeTimer = setTimeout(() => {
            executeCombat(chosenAttacker, chosenDefender)
            // Clear the highlights and revert turn back to player
            setSelectedEnemyId(null)
            setSelectedHeroId(null)
            setIsPlayerTurn(true)
            console.log(
              'Enemy AI: Turn complete, switching back to player turn.'
            )
          }, 1000)
        }, 1000)
      } else {
        console.log('Enemy AI: No valid targets or attackers available.')
        setIsPlayerTurn(true)
      }
    }, 500) // initial 500ms delay for visual feedback

    // Cleanup timers on component unmount
    return () => {
      clearTimeout(enemySelectTimer)
      clearTimeout(heroSelectTimer)
      clearTimeout(executeTimer)
    }
  }, [])

  // --- Rendering Logic (same as GameBoard) ---
  const filterByRow = (roster, row) => roster.filter(unit => unit.row === row)

  const enemyBackRow = filterByRow(enemyRoster, 'back')
  const enemyFrontRow = filterByRow(enemyRoster, 'front')
  const heroFrontRow = filterByRow(heroRoster, 'front')
  const heroBackRow = filterByRow(heroRoster, 'back')

  return (
    <div class='h-screen w-screen bg-gray-900 flex flex-col items-center justify-center py-2 text-xs md:text-lg lg:text-lg relative'>
      {/* Enemy Turn Indicator */}
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

      {/* Render Hero Rows */}
      <div class='flex flex-row gap-2 mt-2 justify-center min-h-[120px] items-center'>
        {heroFrontRow.map(unit => (
          <div
            key={unit.id}
            className={`${
              unit.id === selectedHeroId ? 'border-2 border-rose-600' : ''
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
              unit.id === selectedHeroId ? 'border-2 border-rose-600' : ''
            }`}
          >
            <Card {...unit} className='card' />
          </div>
        ))}
      </div>
    </div>
  )
}
