import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Standard security headers
export const securityHeaders = helmet();

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: True,
  legacyHeaders: False,
});

// Stricter rate limiting for AI generation endpoints to prevent API abuse/cost overruns
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 generation requests per hour
  message: 'AI generation quota exceeded for this IP, please try again later',
});
