import React from "react";

function CalendarHeader() {
  return (
    <div className="header">
      <h1>📅 React Performance Calendar</h1>

      <h3>August 2026</h3>
    </div>
  );
}

export default React.memo(CalendarHeader);