// src/components/Card.jsx
import { h } from "preact";

export default function Card({ id, type, hp, status, onClick, team }) { // Added type prop
  const nameColor = team === "enemy" ? "text-rose-400" : "text-teal-200";
  const isKilled = status === "killed";

  // Base classes
  let cardClasses = "font-mono py-4 border border-gray-700 bg-gray-800 rounded-lg shadow-md flex flex-col focus:outline-none selection:bg-transparent w-40";

  // Add styles for killed units
  if (isKilled) {
    cardClasses += " opacity-50 cursor-not-allowed"; // Grey out and change cursor
  } else {
    cardClasses += " hover:bg-slate-600"; // Only allow hover effect if not killed
  }

  return (
    <button
      onClick={!isKilled ? onClick : undefined} // Disable onClick if killed
      disabled={isKilled} // Disable the button element if killed
      class={cardClasses}
    >
      <div class="font-serif font-thin text-gray-300">{id}</div>
      <div class={`font-semibold text-xxs mb-2 ${nameColor}`}>{type}</div> {/* Display type instead of id */}
      {/* Show HP only if not killed, or show 0 if killed */}
     
      <div class="text-green-400 font-semibold text-xxs">{isKilled ? 0 : hp} hp</div>
      {/* Display status, maybe different color if killed */}
      <div class={isKilled ? "text-gray-500 text-xxs" : "text-red-400 text-xxs"}>{status}</div>
    </button>
  );
}
