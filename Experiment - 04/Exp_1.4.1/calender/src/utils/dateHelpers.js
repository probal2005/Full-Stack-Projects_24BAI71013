// Format date as YYYY-MM-DD
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get days in month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get first day of month (0=Sun, 1=Mon, ...)
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

// Create a date object from year, month, day
export const createDate = (year, month, day) => {
  return new Date(year, month, day);
};

// Check if two dates are the same day
export const isSameDay = (date1, date2) => {
  return formatDate(date1) === formatDate(date2);
};

// Get today's date as string
export const getToday = () => formatDate(new Date());