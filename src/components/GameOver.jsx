// src/components/GameOver.jsx
import { h } from 'preact'

export default function GameOver() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-800 text-gray-200">
      <h1 className="text-4xl md:text-5xl font-bold text-amber-400 tracking-wider">
        Game Over
      </h1>
    </div>
  )
}
