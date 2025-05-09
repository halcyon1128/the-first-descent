// src/App.jsx
import { h } from 'preact'
// import { useCombatTracking } from './contexts/CombatTrackingContext'
// import { PlayerProvider } from './contexts/PlayerContext'
import { PlayerProvider } from './contexts/PlayerContext'
// import { ActionProvider } from './contexts/ActionContext'
import { ActionProvider } from './contexts/ActionContext'
// import { CombatTrackingProvider } from './contexts/CombatTrackingContext'
import { useCombatTracking, CombatTrackingProvider } from './contexts/CombatTrackingContext'
// import { ModalProvider } from './contexts/ModalContext' // Import ModalProvider
import { ModalProvider } from './contexts/ModalContext'
import GameBoard from './components/GameBoard'
import EnemyBoard from './components/EnemyBoard'
import NewGame from './components/NewGame'
import GameOver from './components/GameOver'

// Component that uses combat tracking to decide what to render
const AppContent = () => {
  const { isPlayerTurn, isGameOver, isNewGame } = useCombatTracking()

  // Debug logging (remove or comment out in production)
  console.log({ isPlayerTurn, isGameOver, isNewGame })

  switch (true) {
    case isNewGame:
      return <NewGame />
    case isGameOver:
      return <GameOver />
    case isPlayerTurn && !isGameOver:
      return <GameBoard />
    case !isPlayerTurn && !isGameOver:
      return <EnemyBoard />
  }
}

export function App () {
  return (
    <PlayerProvider>
      <CombatTrackingProvider>
        <ModalProvider> {/* Wrap ActionProvider and AppContent with ModalProvider */}
          <ActionProvider>
            <AppContent />
          </ActionProvider>
        </ModalProvider>
      </CombatTrackingProvider>
    </PlayerProvider>
  )
}

export default App
