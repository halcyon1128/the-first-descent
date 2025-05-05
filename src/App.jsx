// src/App.jsx
import { h } from 'preact'

import { PlayerProvider } from './contexts/PlayerContext'
import { ActionProvider } from './contexts/ActionContext'
// import { RosterInitializer } from './contexts/RosterInitializer'
import GameBoard from './components/GameBoard'

export function App () {
  return (
    <PlayerProvider>
      <ActionProvider>
        {/* <RosterInitializer /> */}
        <GameBoard />
      </ActionProvider>
    </PlayerProvider>
  )
}
