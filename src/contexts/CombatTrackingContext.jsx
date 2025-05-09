// src/contexts/CombatTrackingContext.jsx
import { h, createContext } from 'preact'
import { useState, useContext, useEffect } from 'preact/hooks'
// Import PlayerContext to access heroRoster and enemyRoster
import { PlayerContext } from './PlayerContext'

const CombatTrackingContext = createContext()

export const useCombatTracking = () => useContext(CombatTrackingContext)

const CombatTrackingProvider = ({ children }) => {
  // Get player rosters from PlayerContext
  const { heroRoster, enemyRoster } = useContext(PlayerContext)

  const [isPlayerTurn, setIsPlayerTurn] = useState(true)

  // Log turn state changes for debugging purposes
  useEffect(() => {
    console.log(`Is Player Turn: ${isPlayerTurn}`)
  }, [isPlayerTurn])

  // Compute isGameOver: if either team's every unit is "killed" (hp <= 0 or status === 'killed')
  const isGameOver =
    (heroRoster.length > 0 &&
      heroRoster.every(unit => unit.hp <= 0 || unit.status === 'killed')) ||
    (enemyRoster.length > 0 &&
      enemyRoster.every(unit => unit.hp <= 0 || unit.status === 'killed'))

  // Compute isNewGame: a new game if both rosters are empty
  const isNewGame = heroRoster.length === 0 && enemyRoster.length === 0

  return (
    <CombatTrackingContext.Provider
      value={{
        isPlayerTurn,
        setIsPlayerTurn,
        isGameOver,
        isNewGame
      }}
    >
      {children}
    </CombatTrackingContext.Provider>
  )
}

export { CombatTrackingProvider }
