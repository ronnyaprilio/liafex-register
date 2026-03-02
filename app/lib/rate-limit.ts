type Attempt = {
  count: number;
  lastAttempt: number;
};

const attempts = new Map<string, Attempt>();

const MAX_ATTEMPTS = 5;
const WINDOW_TIME = 60 * 1000;

export function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry) {
    attempts.set(key, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  if (now - entry.lastAttempt > WINDOW_TIME) {
    attempts.set(key, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false };
  }

  entry.count += 1;
  entry.lastAttempt = now;
  attempts.set(key, entry);

  return { allowed: true };
}