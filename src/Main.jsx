// src/main.jsx
import { render } from 'preact'
import App from './App'
import './tailwind.css' // assuming your global styles are here

// Render the App component into the element with id "app"
render(<App />, document.getElementById('app'))
