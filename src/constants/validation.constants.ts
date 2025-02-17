export const PASSWORD_VALIDATION = {
  MIN_LENGTH: 8,
  PATTERN: /^(?=.*[A-Z])(?=.*\d)/,
  ERROR_MESSAGES: {
    MIN_LENGTH: "Password must be at least 8 characters",
    PATTERN: "Password must contain at least 1 uppercase letter and 1 number",
    MATCH: "Passwords must match",
  },
} as const;

export const EMAIL_VALIDATION = {
  PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  ERROR_MESSAGES: {
    INVALID: "Please enter a valid email address",
    REQUIRED: "Email is required",
  },
} as const; 