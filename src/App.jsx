// src/App.jsx
import { h } from 'preact'
import { useContext } from 'preact/hooks' // Import useContext

import { PlayerProvider } from './contexts/PlayerContext'
import { ActionProvider } from './contexts/ActionContext'
import {
  CombatTrackingProvider,
  useCombatTracking
} from './contexts/CombatTrackingContext' // Import useCombatTracking
import GameBoard from './components/GameBoard'
import EnemyBoard from './components/EnemyBoard' // Import EnemyBoard

// Inner component to access context
const AppContent = () => {
  const { isPlayerTurn } = useCombatTracking() // Get isPlayerTurn from context

  return (
    <PlayerProvider>
      <ActionProvider>
        {isPlayerTurn ? <GameBoard /> : <EnemyBoard />}{' '}
        {/* Conditional Rendering based on isPlayerTurn */}
      </ActionProvider>
    </PlayerProvider>
  )
}

export function App () {
  return (
    <CombatTrackingProvider>
      {' '}
      {/* CombatTrackingProvider needs to wrap the component using its context */}
      <AppContent />
    </CombatTrackingProvider>
  )
}
