import crypto from 'crypto';

let runtimeFallbackSecret = null;

/**
 * Returns the configured JWT_SECRET, or generates an unguessable per-process
 * fallback secret for local development when JWT_SECRET is not set.
 */
export const getJwtSecret = () => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length >= 16) {
    return process.env.JWT_SECRET.trim();
  }
  if (!runtimeFallbackSecret) {
    runtimeFallbackSecret = crypto.randomBytes(32).toString('hex');
    console.warn('⚠️  JWT_SECRET not set in .env — using an ephemeral random secret for this session.');
  }
  return runtimeFallbackSecret;
};
