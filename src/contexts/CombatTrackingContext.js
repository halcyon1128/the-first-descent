import { h, createContext } from 'preact'
import { useState, useContext, useEffect } from 'preact/hooks'

const CombatTrackingContext = createContext()

export const useCombatTracking = () => useContext(CombatTrackingContext)

const CombatTrackingProvider = ({ children }) => {
  const [isPlayerTurn, setIsPlayerTurn] = useState(true) // State for turn tracking

  // Log turn state changes
  useEffect(() => {
    console.log(`Is Player Turn: ${isPlayerTurn}`)
  }, [isPlayerTurn])

  return (
    <CombatTrackingContext.Provider
      value={{ isPlayerTurn, setIsPlayerTurn }} // Expose turn state and setter
    >
      {children}
    </CombatTrackingContext.Provider>
  )
}

// ✅ Explicitly export CombatTrackingProvider
export { CombatTrackingProvider }
