import { createContext } from 'preact'
import { useState, useEffect } from 'preact/hooks'

export const PlayerContext = createContext()

export function PlayerProvider ({ children }) {
  const [heroRoster, setHeroRoster] = useState([])
  const [enemyRoster, setEnemyRoster] = useState([])

  // Initial Roster (could be fetched from a server, or static data like in the previous example)
  const initialRoster = [
    // HEROES
    // {
    //   id: 'Pathfinder',
    //   type: 'Assassin',
    //   maxHp: 1,
    //   hp: 1,
    //   atk: 0.8,
    //   def: 0.4,
    //   status: 'healthy',
    //   row: 'back',
    //   team: 'hero'
    // },
    // {
    //   id: 'Sircam',
    //   type: 'Knight',
    //   maxHp: 2,
    //   hp: 2,
    //   atk: 1.1,
    //   def: 0.6,
    //   status: 'healthy',
    //   row: 'front',
    //   team: 'hero'
    // },
    // ... (Add your initial heroes and enemies here)
  ]

  function sortUnits (roster) {
    const heroes = roster.filter(unit => unit.team === 'hero')
    const enemies = roster.filter(unit => unit.team === 'enemy')
    return { heroes, enemies }
  }

  // Effect to initialize rosters when the component is mounted
  useEffect(() => {
    const { heroes, enemies } = sortUnits(initialRoster)
    setHeroRoster(heroes)
    setEnemyRoster(enemies)
  }, [])

  // This function is responsible for updating the rosters based on the updates from NewGame
  const updateHeroRoster = newHeroRoster => {
    setHeroRoster(newHeroRoster)
  }

  const updateEnemyRoster = newEnemyRoster => {
    setEnemyRoster(newEnemyRoster)
  }

  return (
    <PlayerContext.Provider
      value={{
        heroRoster,
        enemyRoster,
        setHeroRoster: updateHeroRoster, // Allow NewGame to set hero roster
        setEnemyRoster: updateEnemyRoster // Allow NewGame to set enemy roster
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
