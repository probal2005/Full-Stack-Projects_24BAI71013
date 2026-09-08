import React, { useMemo } from "react";
import Calendar from "./components/Calendar";
import events from "./data/events";
import "./App.css";

function App() {
  // Memoize events (Experiment Requirement)
  const memoizedEvents = useMemo(() => {
    console.log("Loading Events...");
    return events;
  }, []);

  return (
    <div className="app">
      <Calendar events={memoizedEvents} />
    </div>
  );
}

export default App;