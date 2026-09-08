import { useState } from 'react';
import { useCalendar } from './hooks/useCalendar';
import MonthNavigation from './components/MonthNavigation';
import Calendar from './components/Calendar';
import AddEditEventModal from './components/AddEditEventModal';
import './index.css';

function App() {
  const {
    currentDate,
    calendarData,
    getEventsForDate,
    addPost,
    updatePost,
    deletePost,
    movePost,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
  } = useCalendar();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [defaultDate, setDefaultDate] = useState('');

  const handleAddClick = (dateStr) => {
    setDefaultDate(dateStr);
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setDefaultDate(event.date);
    setModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Delete this post?')) {
      deletePost(id);
    }
  };

  const handleDrop = (eventId, newDate) => {
    movePost(eventId, newDate);
  };

  const handleSave = (postData) => {
    if (editingEvent) {
      updatePost(editingEvent.id, postData);
    } else {
      addPost(postData);
    }
    setModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="app-header">
          <h1>📅 Post Scheduler</h1>
          <p>Drag events to reschedule • Click a day to add</p>
        </div>
        <MonthNavigation
          currentDate={currentDate}
          onPrev={goToPrevMonth}
          onNext={goToNextMonth}
          onToday={goToToday}
        />
        <Calendar
          calendarData={calendarData}
          currentDate={currentDate}
          getEventsForDate={getEventsForDate}
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onDrop={handleDrop}
        />
      </div>
      <AddEditEventModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEvent(null); }}
        onSave={handleSave}
        initialData={editingEvent}
        defaultDate={defaultDate}
      />
    </div>
  );
}

export default App;