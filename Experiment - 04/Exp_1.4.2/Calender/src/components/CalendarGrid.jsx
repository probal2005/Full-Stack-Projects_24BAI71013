import React, { useMemo } from "react";
import CalendarDay from "./CalendarDay";

function CalendarGrid({ events, onSelect }) {
  const calendar = useMemo(() => {
    const firstDay = new Date(2026, 7, 1).getDay(); // August = 7
    const totalDays = 31;

    const cells = [];

    // Empty cells before August 1
    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }

    // Days
    for (let day = 1; day <= totalDays; day++) {
      cells.push(day);
    }

    return cells;
  }, []);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <div className="calendar-grid">
        {weekDays.map((day) => (
          <div key={day} className="week-day">
            {day}
          </div>
        ))}

        {calendar.map((day, index) => {
          if (day === null) {
            return <div key={index} className="empty-day"></div>;
          }

          const event = events.find((e) => e.date === day);

          return (
            <CalendarDay
              key={day}
              day={day}
              event={event}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(CalendarGrid);