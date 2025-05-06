import { h } from 'preact'
import { useEffect, useContext } from 'preact/hooks'
import { useCombatTracking } from '../contexts/CombatTrackingContext'
import Card from './Card'
import { PlayerContext } from '../contexts/PlayerContext'
import { ActionContext } from '../contexts/ActionContext'

export default function EnemyBoard () {
  const { heroRoster, enemyRoster } = useContext(PlayerContext)
  const { setIsPlayerTurn } = useCombatTracking() // Get setIsPlayerTurn, remove actionCount/resetAction
  const { executeCombat } = useContext(ActionContext)

  // --- Enemy AI Logic ---
  // This useEffect runs once when EnemyBoard mounts (i.e., when isPlayerTurn becomes false)
  useEffect(() => {
    console.log('EnemyBoard: Mounted, initiating enemy turn...')

    // Add a small delay for visual feedback (optional)
    const timer = setTimeout(() => {
      // Filter for living units only
      const livingEnemies = enemyRoster.filter(unit => unit.status !== 'killed')
      const livingHeroes = heroRoster.filter(unit => unit.status !== 'killed')

      if (livingEnemies.length > 0 && livingHeroes.length > 0) {
        // Simple AI: Select a random living enemy attacker
        const attacker =
          livingEnemies[Math.floor(Math.random() * livingEnemies.length)]

        // Simple AI: Select a random living hero defender
        const defender =
          livingHeroes[Math.floor(Math.random() * livingHeroes.length)]

        console.log(
          `Enemy AI: ${attacker.id} (${attacker.type}) attacking ${defender.id} (${defender.type})`
        )

        // Execute the combat action
        executeCombat(attacker, defender)
      } else {
        console.log('Enemy AI: No valid targets or attackers available.')
      }

      // Set turn back to player immediately after AI turn
      setIsPlayerTurn(true)
      console.log(
        'Enemy AI: Turn complete, setting isPlayerTurn=true (should switch back to GameBoard).'
      )
    }, 500) // 500ms delay

    // Cleanup timeout on component unmount
    return () => clearTimeout(timer)
  }, []) // Empty dependency array ensures this runs only once on mount

  // --- Rendering Logic (similar to GameBoard) ---
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

      {/* Render the board layout (same as GameBoard) */}
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
    </div>
  )
}
