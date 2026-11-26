/**
 * Lightweight zero-dependency in-memory rate limiter keyed by client IP.
 */
export const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 30, message = 'Too many requests, please try again later.' } = {}) => {
  const hits = new Map();

  // Periodically prune expired entries to prevent unbounded memory growth
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits.entries()) {
      if (now > entry.resetAt) {
        hits.delete(key);
      }
    }
  }, Math.min(windowMs, 5 * 60 * 1000));
  if (cleanupInterval.unref) cleanupInterval.unref();

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = hits.get(ip);

    if (!entry || now > entry.resetAt) {
      entry = { count: 1, resetAt: now + windowMs };
      hits.set(ip, entry);
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfterSec));
      return res.status(429).json({ success: false, message });
    }

    return next();
  };
};

export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please wait 15 minutes and try again.'
});

export const publicPostLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: 'Too many submissions from this IP. Please try again later.'
});

export const uploadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many file uploads. Please wait a few minutes and try again.'
});
