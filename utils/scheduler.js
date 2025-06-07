import moment from 'moment';

/**
 * Parses a string like "8-10, 14-16" into an array of time range objects.
 * @param {string} timeString
 * @returns {Array<{ start: number, end: number }>}
 */
function parseTimeRanges(timeString) {
  if (!timeString) return [];
  return timeString.split(',').map(range => {
    const [start, end] = range.trim().split('-').map(Number);
    return { start, end };
  });
}

/**
 * Converts the freeTime object into a list of all available slots with dates.
 * @param {Object} freeTime - e.g., { Monday: "9-11", Tuesday: "14-15" }
 * @param {moment.Moment} startDate
 * @returns {Array<{ day: string, date: string, start: number, end: number }>}
 */
function getAllAvailableSlots(freeTime, startDate) {
  const slots = [];

  for (let i = 0; i < 7; i++) {
    const date = moment(startDate).add(i, 'days');
    const day = date.format('dddd'); // e.g., "Monday"
    const ranges = parseTimeRanges(freeTime[day]);

    ranges.forEach(({ start, end }) => {
      slots.push({
        day,
        date: date.format('YYYY-MM-DD'),
        start,
        end,
      });
    });
  }

  return slots;
}

/**
 * Schedules tasks based on available weekly free time and task deadlines.
 * @param {Object} freeTime - user's available time by weekday
 * @param {Array} tasks - array of { title, duration, deadline }
 * @returns {Array} scheduled - array of { taskTitle, date, start, end, minutesAllocated }
 */
export function scheduleTasks(freeTime, tasks) {
  const startDate = moment(); // today
  const availableSlots = getAllAvailableSlots(freeTime, startDate);

  // Sort tasks by deadline ascending
  const sortedTasks = [...tasks].sort((a, b) =>
    moment(a.deadline).diff(moment(b.deadline))
  );

  const schedule = [];

  for (const task of sortedTasks) {
    let timeNeeded = task.duration; // in minutes
    const deadline = moment(task.deadline);

    for (const slot of availableSlots) {
      const slotStart = moment(`${slot.date} ${slot.start}:00`, 'YYYY-MM-DD H:mm');
      const slotEnd = moment(`${slot.date} ${slot.end}:00`, 'YYYY-MM-DD H:mm');
      const slotLength = slotEnd.diff(slotStart, 'minutes');

      if (moment(slot.date).isAfter(deadline)) continue;
      if (slotLength < 1) continue;

      const usableTime = Math.min(timeNeeded, slotLength);
      const endTime = slot.start + usableTime / 60;

      schedule.push({
        taskTitle: task.title,
        date: slot.date,
        start: slot.start,
        end: endTime,
        minutesAllocated: usableTime,
      });

      timeNeeded -= usableTime;
      slot.start += usableTime / 60; // shrink available slot

      if (timeNeeded <= 0) break;
    }

    if (timeNeeded > 0) {
      console.warn(`Could not fully schedule task: ${task.title}`);
    }
  }

  return schedule;
}
