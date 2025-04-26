// src/App.jsx
import { h } from "preact";
import { GameProvider } from "./contexts/GameContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import { ActionProvider } from "./contexts/ActionContext";
import GameBoard from "./components/GameBoard";

export function App() {
  return (
    <GameProvider>
      <PlayerProvider>
        <ActionProvider>
          <GameBoard />
        </ActionProvider>
      </PlayerProvider>
    </GameProvider>
  );
}
