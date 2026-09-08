export default function MonthNavigation({ currentDate, onPrev, onNext, onToday }) {
  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  return (
    <div className="month-nav">
      <button onClick={onPrev}>‹</button>
      <span className="month-label">{monthYear}</span>
      <button onClick={onNext}>›</button>
      <button onClick={onToday} className="today-btn">Today</button>
    </div>
  );
}