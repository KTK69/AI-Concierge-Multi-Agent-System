export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''));
}

export function extractEmailFromText(text: string): string | null {
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
}

export function extractPhoneFromText(text: string): string | null {
  const phoneRegex = /(\+?\d{1,4}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function calculateResponseTime(startTime: number): number {
  return Date.now() - startTime;
}

export function isBusinessHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  // Monday = 1, Sunday = 0
  const isWeekday = day >= 1 && day <= 5;
  const isBusinessHour = hour >= 9 && hour < 17;
  
  return isWeekday && isBusinessHour;
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Common conversation starters and responses
export const CONVERSATION_STARTERS = [
  "Hi there! I'm your AI Career Coach. What brings you here today?",
  "Hello! I'd love to help you with your career goals. What's on your mind?",
  "Welcome! I'm here to help you navigate your career journey. How can I assist you?",
];

export const FALLBACK_RESPONSES = [
  "That's an interesting point. Could you tell me more about your specific situation?",
  "I'd love to help you with that. Can you provide a bit more context?",
  "Let me understand better - what's your main career challenge right now?",
];

export const BOOKING_PROMPTS = [
  "It sounds like you could benefit from a personalized strategy session. Would you be interested in a free 30-minute consultation?",
  "Based on our conversation, I think a one-on-one session could really help accelerate your progress. Shall we schedule a call?",
  "You're asking great questions! I'd love to dive deeper into your specific situation. How about we book a consultation?",
];

// UTM parameter tracking
export function getUTMParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
} {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
  };
}

// Local storage helpers
export function getFromLocalStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setToLocalStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function removeFromLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently fail if localStorage is not available
  }
}
