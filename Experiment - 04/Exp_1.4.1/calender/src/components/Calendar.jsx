import CalendarDay from './CalendarDay';
import EventItem from './EventItem';

export default function Calendar({ calendarData, currentDate, getEventsForDate, onAdd, onEdit, onDelete, onDrop }) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar">
      <div className="calendar-header">
        {weekDays.map(day => (
          <div key={day} className="week-day">{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {calendarData.map(({ date, isCurrentMonth }, index) => {
          const dateStr = date.toISOString().slice(0, 10);
          const events = getEventsForDate(dateStr);
          return (
            <CalendarDay
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth}
              events={events}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              onDrop={onDrop}
            />
          );
        })}
      </div>
    </div>
  );
}