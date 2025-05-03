import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { PlayerContext } from '../contexts/PlayerContext'
import { ActionContext } from '../contexts/ActionContext'
import Card from './Card'

export default function GameBoard () {
  const { heroRoster, enemyRoster } = useContext(PlayerContext)
  const { selectedAttacker } = useContext(ActionContext)

  const filterByRow = (roster, row) => roster.filter(unit => unit.row === row)

  const enemyBackRow = filterByRow(enemyRoster, 'back')
  const enemyFrontRow = filterByRow(enemyRoster, 'front')
  const heroFrontRow = filterByRow(heroRoster, 'front')
  const heroBackRow = filterByRow(heroRoster, 'back')

  return (
    <div class='h-screen w-screen bg-gray-900 flex flex-col items-center justify-center py-2 text-xs md:text-lg lg:text-lg'>
      <div class='flex flex-row gap-2 justify-center min-h-[120px] items-center'>
        {enemyBackRow.map(unit => (
          <Card {...unit} isSelected={null} />
        ))}
      </div>
      <div class='flex flex-row gap-2 mt-2 justify-center min-h-[120px] items-center'>
        {enemyFrontRow.map(unit => (
          <Card {...unit} isSelected={null} />
        ))}
      </div>

      <div class='h-16'></div>

      <div class='flex flex-row gap-2 mt-2 justify-center min-h-[120px] items-center'>
        {heroFrontRow.map(unit => (
          <Card {...unit} isSelected={null} />
        ))}
      </div>
      <div class='flex flex-row gap-2 mt-2 justify-center min-h-[120px] items-center'>
        {heroBackRow.map(unit => (
          <Card {...unit} isSelected={null} />
        ))}
      </div>
    </div>
  )
}
