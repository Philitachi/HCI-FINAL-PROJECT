const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;

export const toTimestampMs = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (value instanceof Date) {
    const timestamp = value.getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
  }

  if (typeof value.toDate === 'function') {
    const date = value.toDate();
    return toTimestampMs(date);
  }

  if (typeof value.seconds === 'number') {
    const milliseconds = value.seconds * 1000;
    const extraMilliseconds = Math.floor((value.nanoseconds || 0) / 1000000);
    return milliseconds + extraMilliseconds;
  }

  return null;
};

const formatMonthDay = (timestamp, nowTimestamp) => {
  const date = new Date(timestamp);
  const nowDate = new Date(nowTimestamp);
  const includeYear = date.getFullYear() !== nowDate.getFullYear();

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
  });
};

export const formatRelativeDateTime = (value, nowTimestamp = Date.now()) => {
  const timestamp = toTimestampMs(value);

  if (timestamp === null) {
    return '';
  }

  const diffMs = Math.max(0, nowTimestamp - timestamp);
  const diffMinutes = Math.floor(diffMs / MINUTE_MS);
  const diffHours = Math.floor(diffMs / HOUR_MS);
  const diffDays = Math.floor(diffMs / DAY_MS);
  const diffWeeks = Math.floor(diffMs / WEEK_MS);

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }

  if (diffWeeks < 5) {
    return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
  }

  return formatMonthDay(timestamp, nowTimestamp);
};
