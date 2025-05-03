// src/contexts/PlayerContext.js
import { createContext } from 'preact'
import { useState, useEffect } from 'preact/hooks'

export const PlayerContext = createContext()

export function PlayerProvider ({ children }) {
  // Use single arrays for rosters
  const [heroRoster, setHeroRoster] = useState([])
  const [enemyRoster, setEnemyRoster] = useState([])

  // Run only once on mount to initialize rosters
  useEffect(() => {
    const initialHeroes = [
      // Front row heroes
      {
        id: 'Reinhardt',
        type: 'Knight',
        row: 'front',
        team: 'hero',
        hp: 2,
        maxHp: 2,
        atk: 1,
        def: 0.5,
        status: 'healthy'
      },
      // Back row heroes
      {
        id: 'Sully',
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
        id: 'Julian',
        type: 'Priest',
        row: 'back',
        team: 'hero',
        hp: 1,
        maxHp: 1,
        atk: 0.2,
        def: 0.2,
        status: 'healthy'
      }
    ]

    const initialEnemies = [
      // Front row enemies
      {
        id: 'Muck-muck',
        type: 'Slime',
        row: 'front',
        team: 'enemy',
        hp: 1,
        maxHp: 1,
        atk: 0.2,
        def: 0,
        status: 'healthy'
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
      // Back row enemies
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
        status: 'maimed'
      }
    ]

    setHeroRoster(initialHeroes)
    setEnemyRoster(initialEnemies)
  }, []) // Empty dependency array ensures this runs only once on mount

  return (
    <PlayerContext.Provider
      // Provide the flat arrays and their setters
      value={{ heroRoster, enemyRoster, setHeroRoster, setEnemyRoster }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
