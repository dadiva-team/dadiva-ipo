export const sanitizeInput = (inputValue: string): string => {
  // Step 1: Normalize Unicode characters to a consistent form (NFC)
  let sanitizedValue = inputValue.normalize('NFC');

  // Step 2: Trim whitespace from both ends and replace multiple spaces with a single space
  sanitizedValue = sanitizedValue.replace(/\s+/g, ' ').trim();

  // Step 3: Remove unwanted characters, only allowing alphanumeric characters and spaces
  sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9 ]/g, '');

  // Step 4: Escape HTML entities to prevent XSS attacks
  sanitizedValue = sanitizedValue
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return sanitizedValue;
};
