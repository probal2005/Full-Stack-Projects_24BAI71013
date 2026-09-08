import React, { useState, useCallback } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import SearchBar from "./SearchBar";

function Calendar({ events }) {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter events
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  // Memoized click handler
  const handleSelect = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  return (
    <div className="calendar-container">
      <CalendarHeader />

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <CalendarGrid
        events={filteredEvents}
        onSelect={handleSelect}
      />

      {selectedEvent && (
        <div className="event-details">
          <h2>📌 Event Details</h2>

          <h3>{selectedEvent.title}</h3>

          <p>
            <strong>Date:</strong> {selectedEvent.date} August 2026
          </p>

          <p>{selectedEvent.description}</p>
        </div>
      )}
    </div>
  );
}

export default React.memo(Calendar);