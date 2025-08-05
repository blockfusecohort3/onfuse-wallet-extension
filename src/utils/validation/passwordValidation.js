// src/utils/validation/passwordValidation.js
export const validatePassword = (password) => {
    const errors = [];
    
    // Check minimum length
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    // Check for number
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  export const getPasswordStrength = (password) => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++; // Special characters
    
    if (score < 2) return { strength: 'Weak', color: 'text-red-500' };
    if (score < 4) return { strength: 'Medium', color: 'text-yellow-500' };
    return { strength: 'Strong', color: 'text-green-500' };
  };
  