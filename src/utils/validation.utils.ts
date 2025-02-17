import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from '@/constants/validation.constants';

export const validateResetRequest = {
  email: (email: string): boolean => {
    return EMAIL_VALIDATION.PATTERN.test(email.trim().toLowerCase());
  },
  
  password: (password: string): boolean => {
    return (
      password.length >= PASSWORD_VALIDATION.MIN_LENGTH && 
      PASSWORD_VALIDATION.PATTERN.test(password)
    );
  },
  
  token: (token: string): boolean => {
    // Token should be a 64-character hex string
    return /^[a-f0-9]{64}$/.test(token);
  }
}; 