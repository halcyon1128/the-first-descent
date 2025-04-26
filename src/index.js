// src/index.js
import { h, render } from "preact";
import { App } from "./App";
import "../tailwind.css";

render(<App />, document.getElementById("app"));
