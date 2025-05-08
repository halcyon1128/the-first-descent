// src/components/GameOver.jsx
import { h } from 'preact'

export default function GameOver () {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <h1 style={{ fontSize: '4em' }}>GameOver component</h1>
    </div>
  )
}
