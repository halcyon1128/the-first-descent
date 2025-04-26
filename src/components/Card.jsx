// src/components/Card.jsx
import { h } from "preact";

export default function Card({ id, hp, status, onClick }) {
  return (
    <button
      onClick={onClick}
      class="p-4 border border-gray-700 bg-gray-800 text-gray-300 rounded-lg shadow-md flex flex-col gap-2 focus:outline-none hover:bg-slate-600 selection:bg-transparent"
    >
      <div class="font-bold text-yellow-600">{id}</div>
      <div class="text-green-400">HP: {hp}</div>
      <div class="text-red-400">Status: {status}</div>
    </button>
  );
}
