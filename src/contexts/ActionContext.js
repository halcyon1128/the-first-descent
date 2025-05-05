import { createContext } from 'preact'
import { useState, useContext, useCallback, useEffect } from 'preact/hooks'
import { PlayerContext } from './PlayerContext'
import { processCombat, isValidCombatPair } from '../utils/combatUtils'

export const ActionContext = createContext()

export function ActionProvider ({ children }) {
  const { heroRoster, enemyRoster, setHeroRoster, setEnemyRoster } =
    useContext(PlayerContext)

  const [selectedAttacker, setSelectedAttacker] = useState(null)
  const [selectedDefender, setSelectedDefender] = useState(null)

  // Reset function
  const resetSelection = useCallback(() => {
    setSelectedAttacker(null)
    setSelectedDefender(null)
    console.log('...')
  }, [])

  // Selection function
  const selectUnit = useCallback(unit => {
    setSelectedAttacker(prevAttacker => {
      if (!prevAttacker) {
        return unit
      }
      // If attacker already set, try setting defender
      setSelectedDefender(prevDefender => {
        if (!prevDefender) {
          return unit
        }
        return prevDefender
      })

      return prevAttacker
    })
  }, [])

  // Check if a combat pair is valid
  const isValidSelection = useCallback((attacker, defender) => {
    return isValidCombatPair(attacker, defender)
  }, [])

  // Execute combat between two units
  const executeCombat = useCallback(
    (attacker, defender) => {
      return processCombat(
        attacker,
        defender,
        heroRoster,
        enemyRoster,
        setHeroRoster,
        setEnemyRoster
      )
    },
    [heroRoster, enemyRoster, setHeroRoster, setEnemyRoster]
  )

  // Auto-run combat and reset when both selected
  useEffect(() => {
    if (selectedAttacker && selectedDefender) {
      executeCombat(selectedAttacker, selectedDefender)
      resetSelection()
    }
  }, [selectedAttacker, selectedDefender, executeCombat, resetSelection])

  const contextValue = {
    selectedAttacker,
    selectedDefender,
    selectUnit,
    resetSelection,
    isValidSelection,
    executeCombat
  }

  return (
    <ActionContext.Provider value={contextValue}>
      {children}
    </ActionContext.Provider>
  )
}
