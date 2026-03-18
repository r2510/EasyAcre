import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkRateLimit,
  getClientIdentifier,
  CHAT_RATE_LIMIT,
  NEWS_RATE_LIMIT,
} from './rate-limit';

describe('getClientIdentifier', () => {
  it('uses x-forwarded-for when present', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': ' 1.2.3.4 , 5.6.7.8' },
    });
    expect(getClientIdentifier(req)).toBe('1.2.3.4');
  });

  it('uses x-real-ip when x-forwarded-for is missing', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-real-ip': '9.9.9.9' },
    });
    expect(getClientIdentifier(req)).toBe('9.9.9.9');
  });

  it('returns "unknown" when no IP headers', () => {
    const req = new Request('http://localhost');
    expect(getClientIdentifier(req)).toBe('unknown');
  });
});

describe('checkRateLimit', () => {
  beforeEach(() => {
    // Rate limit store is in-memory; clear between tests by using unique keys
    // or we need to export a way to clear. For simplicity we use unique keys per test.
  });

  it('allows first request', () => {
    const result = checkRateLimit('test-key-1', { max: 2 });
    expect(result.allowed).toBe(true);
  });

  it('allows requests under max', () => {
    const key = 'test-key-under-max';
    checkRateLimit(key, { max: 3 });
    const second = checkRateLimit(key, { max: 3 });
    expect(second.allowed).toBe(true);
    const third = checkRateLimit(key, { max: 3 });
    expect(third.allowed).toBe(true);
  });

  it('denies when over max', () => {
    const key = 'test-key-over';
    const opts = { max: 2 };
    checkRateLimit(key, opts);
    checkRateLimit(key, opts);
    const third = checkRateLimit(key, opts);
    expect(third.allowed).toBe(false);
    expect('retryAfterMs' in third && third.retryAfterMs).toBeGreaterThan(0);
  });

  it('uses CHAT_RATE_LIMIT and NEWS_RATE_LIMIT shape', () => {
    expect(CHAT_RATE_LIMIT.max).toBe(25);
    expect(NEWS_RATE_LIMIT.max).toBe(30);
  });
});
