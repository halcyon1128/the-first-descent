// src/App.jsx
import { h } from "preact";

import { GameProvider } from "./contexts/GameContext";
import { ModalProvider } from "./contexts/ModalContext";

import GameBoard from "./components/GameBoard";

export function App() {
  return (
    <GameProvider>
      <ModalProvider>
        <div class="min-h-screen bg-gray-900 text-white font-sans p-4">
          <GameBoard />
        </div>
      </ModalProvider>
    </GameProvider>
  );
}
