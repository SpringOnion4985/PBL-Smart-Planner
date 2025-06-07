import moment from 'moment';

// Convert string like "8-10, 14-16" to an array of { start, end }
function parseTimeRanges(timeString) {
  if (!timeString) return [];
  return timeString.split(',').map(range => {
    const [start, end] = range.trim().split('-').map(Number);
    return { start, end };
  });
}

// Flatten free time map to array of { day, date, start, end }
function getAllAvailableSlots(freeTime, startDate) {
  const slots = [];
  for (let i = 0; i < 7; i++) {
    const date = moment(startDate).add(i, 'days');
    const day = date.format('dddd');
    const ranges = parseTimeRanges(freeTime[day]);
    ranges.forEach(({ start, end }) => {
      slots.push({ day, date: date.format('YYYY-MM-DD'), start, end });
    });
  }
  return slots;
}

export function scheduleTasks(freeTime, tasks) {
  const startDate = moment(); // today
  const availableSlots = getAllAvailableSlots(freeTime, startDate);

  // Sort tasks by deadline
  const sortedTasks = tasks.sort((a, b) => moment(a.deadline).diff(moment(b.deadline)));

  const schedule = [];

  for (const task of sortedTasks) {
    let timeNeeded = task.duration; // in minutes
    const deadline = moment(task.deadline);

    for (const slot of availableSlots) {
      const slotEnd = moment(`${slot.date} ${slot.end}:00`, 'YYYY-MM-DD H:mm');
      const slotStart = moment(`${slot.date} ${slot.start}:00`, 'YYYY-MM-DD H:mm');
      const slotLength = slotEnd.diff(slotStart, 'minutes');

      if (slot.date > deadline.format('YYYY-MM-DD')) continue;
      if (slotLength < 1) continue;

      const actualStart = slotStart.format('HH:mm');
      const usableTime = Math.min(timeNeeded, slotLength);

      schedule.push({
        taskTitle: task.title,
        date: slot.date,
        start: slot.start,
        end: slot.start + usableTime / 60,
        minutesAllocated: usableTime
      });

      timeNeeded -= usableTime;
      slot.start += usableTime / 60;

      if (timeNeeded <= 0) break;
    }
  }

  return schedule;
}
