// Simple client-side validation helpers

export const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export function isValidEmail(email) {
  return emailPattern.test(String(email).toLowerCase());
}

export function isValidPassword(pw) {
  return typeof pw === 'string' && pw.length >= 6;
}

export function hasMinWords(text, min = 50) {
  if (!text) return false;
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  return words.length >= min;
}

// Lightweight YouTube URL validation and videoId extraction
export function validateYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return { isValid: false, message: 'Please enter a valid YouTube video URL.' };
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([\w-]{11})/
  ];

  for (const re of patterns) {
    const m = url.match(re);
    if (m && m[1]) return { isValid: true, videoId: m[1] };
  }

  return { isValid: false, message: 'Please enter a valid YouTube video URL.' };
}
