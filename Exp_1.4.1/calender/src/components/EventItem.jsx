import { useState } from 'react';

export default function EventItem({ event, onEdit, onDelete, onDragStart }) {
  const [showActions, setShowActions] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: event.id, date: event.date }));
    if (onDragStart) onDragStart(event.id);
  };

  return (
    <div
      className="event-item"
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <span className="event-time">{event.time}</span>
      <span className="event-title">{event.title}</span>
      {showActions && (
        <div className="event-actions">
          <button onClick={() => onEdit(event)}>✎</button>
          <button onClick={() => onDelete(event.id)}>✕</button>
        </div>
      )}
    </div>
  );
}