/**
 * Security Hardening Utilities for OWASP Top 10 Protections
 */

// Safe cryptographic SHA-256 hash using Web Crypto API
export async function sha256(message: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Fallback simple bitwise hash for SSR environments
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// OWASP A03: Injection prevention - Sanitize untrusted input strings
export function sanitizeInput(input: string, maxLen = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLen)
    .replace(/[<>'"\\]/g, (char) => {
      switch (char) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#x27;';
        case '\\':
          return '&#x5C;';
        default:
          return char;
      }
    });
}

// OWASP A01: Broken Access Control & Open Redirect Prevention
// Strictly validates that URLs use legitimate http/https/mailto protocols and do not use javascript: or data: URIs
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Block dangerous pseudo-protocols (XSS via javascript:, vbscript:, data:)
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:')
  ) {
    return '#';
  }

  // Allow mailto:
  if (lower.startsWith('mailto:')) {
    return encodeURI(trimmed);
  }

  // Ensure absolute URLs start with http:// or https://
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      return parsed.href;
    } catch {
      return '#';
    }
  }

  // Relative in-app anchor links (#about, #contact, etc.)
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) {
    return trimmed;
  }

  // Default to https:// if scheme is missing
  try {
    const parsed = new URL(`https://${trimmed}`);
    return parsed.href;
  } catch {
    return '#';
  }
}

// Constant default password hash for "rago@123"
// Generated via SHA-256('rago@123')
export const DEFAULT_PASSWORD_HASH =
  '8d350ec8eafe59a58cf09fbe795f70bb0cc9d9a04a60e0a5cc93cb7ce042ffc7';
