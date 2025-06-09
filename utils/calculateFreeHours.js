// utils/calculateFreeHours.js

export const calculateFreeHoursToday = (freeTimeObj) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const ranges = (freeTimeObj?.[today] || "").split(',');
  let totalHours = 0;

  for (const range of ranges) {
    const [start, end] = range.trim().split('-');
    if (!start || !end) continue;

    const [sh, sm = 0] = start.split(':').map(Number);
    const [eh, em = 0] = end.split(':').map(Number);

    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    totalHours += (endMin - startMin) / 60;
  }

  return totalHours.toFixed(1); // Optional: round to 1 decimal
};
