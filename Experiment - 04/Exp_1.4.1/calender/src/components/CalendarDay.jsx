import EventItem from "./EventItem";

export default function CalendarDay({ date, isCurrentMonth, events, onAdd, onEdit, onDelete, onDrop }) {
  const dateStr = date.toISOString().slice(0, 10);
  const isToday = dateStr === new Date().toISOString().slice(0, 10);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    try {
      const { id } = JSON.parse(data);
      onDrop(id, dateStr);
    } catch (err) {
      console.warn('Invalid drop data', err);
    }
  };

  return (
    <div
      className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => onAdd(dateStr)}
    >
      <div className="day-number">{date.getDate()}</div>
      <div className="events-list">
        {events.map(event => (
          <EventItem
            key={event.id}
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}