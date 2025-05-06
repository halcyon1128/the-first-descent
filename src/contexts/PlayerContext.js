import { createContext } from 'preact'
import { useState, useEffect } from 'preact/hooks'

export const PlayerContext = createContext()

export function PlayerProvider ({ children }) {
  const [heroRoster, setHeroRoster] = useState([])
  const [enemyRoster, setEnemyRoster] = useState([])

  const initialRoster = [
    // HEROES
    {
      id: 'Pathfinder',
      type: 'Assassin',
      maxHp: 1,
      hp: 1,
      atk: 0.9,
      def: 0.4,
      status: 'healthy',
      row: 'back',
      team: 'hero'
    },
    {
      id: 'Sircam',
      type: 'Knight',
      maxHp: 2,
      hp: 2,
      atk: 1,
      def: 0.5,
      status: 'healthy',
      row: 'front',
      team: 'hero'
    },
    {
      id: 'Kuroro',
      type: 'Ranger',
      row: 'back',
      team: 'hero',
      hp: 1,
      maxHp: 1,
      atk: 0.8,
      def: 0.2,
      status: 'healthy'
    },
    {
      id: 'Halcyon',
      type: 'Mage',
      row: 'back',
      team: 'hero',
      hp: 1,
      maxHp: 1,
      hp: 1,
      atk: 1.5,
      def: 0.3,
      status: 'healthy'
    },

    ,
    // ENEMIES
    {
      id: 'Cassius',
      type: 'Skeleton_Archer',
      row: 'back',
      team: 'enemy',
      hp: 1,
      maxHp: 1,
      atk: 0.7,
      def: 0.1,
      status: 'healthy'
    },
    {
      id: 'Igwop',
      type: 'Goblin',
      maxHp: 1,
      hp: 1,
      atk: 0.2,
      def: 0.2,
      status: 'healthy',
      row: 'front',
      team: 'enemy'
    },
    {
      id: 'Kinjiro',
      type: 'Orc',
      row: 'front',
      team: 'enemy',
      hp: 2,
      maxHp: 2,
      atk: 0.6,
      def: 0.2,
      status: 'healthy'
    },
    {
      id: "D'Artois",
      type: 'Revenant',
      maxHp: 3,
      hp: 3,
      atk: 0.8,
      def: 0.7,
      status: 'healthy',
      row: 'front',
      team: 'enemy'
    },
    {
      id: 'Kazuma',
      type: 'Orc',
      row: 'front',
      team: 'enemy',
      hp: 2,
      maxHp: 2,
      atk: 0.6,
      def: 0.2,
      status: 'healthy'
    },
    {
      id: 'Opawug',
      type: 'Goblin',
      maxHp: 1,
      hp: 1,
      atk: 0.2,
      def: 0.2,
      status: 'healthy',
      row: 'front',
      team: 'enemy'
    },
    {
      id: 'Pontus',
      type: 'Skeleton_Mage',
      row: 'back',
      team: 'enemy',
      hp: 1,
      maxHp: 1,
      atk: 0.8,
      def: 0.1,
      status: 'healthy'
    },
    {
      id: 'Brutus',
      type: 'Skeleton_Archer',
      row: 'back',
      team: 'enemy',
      hp: 1,
      maxHp: 1,
      atk: 0.7,
      def: 0.1,
      status: 'healthy'
    }
  ]

  function sortUnits (roster) {
    const heroes = roster.filter(unit => unit.team === 'hero')
    const enemies = roster.filter(unit => unit.team === 'enemy')
    return { heroes, enemies }
  }

  useEffect(() => {
    const { heroes, enemies } = sortUnits(initialRoster)
    setHeroRoster(heroes)
    setEnemyRoster(enemies)
  }, [])

  return (
    <PlayerContext.Provider
      value={{ heroRoster, enemyRoster, setHeroRoster, setEnemyRoster }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
