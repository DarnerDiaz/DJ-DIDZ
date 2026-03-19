/**
 * Validation Utilities
 * Input validation and sanitization helpers
 */

/**
 * Validate and parse integer within range
 * @param {string} input - Input string
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {{valid: boolean, value?: number, error?: string}}
 */
function validateIntRange(input, min, max) {
  if (!input || input.trim() === '') {
    return { valid: false, error: 'Value is required' };
  }

  const num = parseInt(input, 10);

  if (isNaN(num)) {
    return { valid: false, error: 'Must be a valid number' };
  }

  if (num < min || num > max) {
    return { valid: false, error: `Value must be between ${min} and ${max}` };
  }

  return { valid: true, value: num };
}

/**
 * Validate non-empty string
 * @param {string} input - Input string
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {{valid: boolean, value?: string, error?: string}}
 */
function validateString(input, minLength = 1, maxLength = 2000) {
  if (!input || input.trim() === '') {
    return { valid: false, error: 'Value is required' };
  }

  const trimmed = input.trim();

  if (trimmed.length < minLength) {
    return { valid: false, error: `Minimum length is ${minLength} characters` };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `Maximum length is ${maxLength} characters` };
  }

  return { valid: true, value: trimmed };
}

/**
 * Sanitize user input (prevent injection attacks)
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 2000); // Max 2000 chars
}

/**
 * Validate voice channel membership
 * @param {Object} member - Discord member object
 * @returns {{valid: boolean, channel?: Object, error?: string}}
 */
function validateVoiceChannel(member) {
  if (!member) {
    return { valid: false, error: 'Member object required' };
  }

  if (!member.voice || !member.voice.channel) {
    return { valid: false, error: 'You must be in a voice channel' };
  }

  return { valid: true, channel: member.voice.channel };
}

/**
 * Ensure arguments exist
 * @param {string[]} args - Arguments array
 * @param {number} required - Number of required arguments
 * @returns {{valid: boolean, error?: string}}
 */
function validateArgs(args, required = 1) {
  if (!args || args.length < required) {
    return { valid: false, error: `At least ${required} argument(s) required` };
  }
  return { valid: true };
}

module.exports = {
  validateIntRange,
  validateString,
  sanitizeInput,
  validateVoiceChannel,
  validateArgs
};
