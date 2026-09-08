import { useState, useEffect, useMemo } from 'react';
import { getPosts, addPost, updatePost, deletePost, movePostToDate } from '../services/postService';
import { getDaysInMonth, getFirstDayOfMonth, formatDate, createDate } from '../utils/dateHelpers';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load posts on mount
  useEffect(() => {
    setEvents(getPosts());
  }, []);

  // Navigate month
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get calendar grid data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month); // 0=Sun

    const days = [];
    // Previous month's trailing days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = createDate(year, month - 1, day);
      days.push({ date, isCurrentMonth: false });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = createDate(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }
    // Next month's leading days
    const totalDays = days.length;
    const remaining = 42 - totalDays; // 6 rows * 7 cols
    for (let i = 1; i <= remaining; i++) {
      const date = createDate(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }
    return days;
  }, [currentDate]);

  // Get events for a specific date (string YYYY-MM-DD)
  const getEventsForDate = (dateStr) => {
    return events.filter(event => event.date === dateStr);
  };

  // CRUD operations that update state
  const handleAddPost = (post) => {
    const newPost = addPost(post);
    setEvents(prev => [...prev, newPost]);
    return newPost;
  };

  const handleUpdatePost = (id, updated) => {
    const result = updatePost(id, updated);
    if (result) {
      setEvents(prev => prev.map(p => p.id === id ? result : p));
    }
    return result;
  };

  const handleDeletePost = (id) => {
    deletePost(id);
    setEvents(prev => prev.filter(p => p.id !== id));
  };

  const handleMovePost = (id, newDate) => {
    const result = movePostToDate(id, newDate);
    if (result) {
      setEvents(prev => prev.map(p => p.id === id ? result : p));
    }
    return result;
  };

  return {
    currentDate,
    calendarData,
    events,
    loading,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    getEventsForDate,
    addPost: handleAddPost,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
    movePost: handleMovePost,
  };
}