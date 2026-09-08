import React from "react";

function CalendarDay({ day, event, onSelect }) {
  const isToday = day === new Date().getDate();

  return (
    <div
      className={`day ${isToday ? "today" : ""}`}
      onClick={() => event && onSelect(event)}
    >
      <div className="day-number">{day}</div>

      {event && (
        <div
          className="event"
          style={{ backgroundColor: event.color }}
        >
          {event.title}
        </div>
      )}
    </div>
  );
}

export default React.memo(CalendarDay);