import { ethers } from 'ethers';

export const isValidENSName = (ensName) => {
  return /^[a-z0-9-]+\.eth$/.test(ensName);
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPhoneNumber = (phoneNumber) => {
  return /^\+?[1-9]\d{1,14}$/.test(phoneNumber);
};

export const isValidAmount = (amount) => {
  return /^(\d+(\.\d{1,18})?|\.\d{1,18})$/.test(amount);
};

export const isValidTransactionHash = (hash) => {
  return /^0x[0-9a-fA-F]{64}$/.test(hash);
};

export const sanitizeForLogging = (input) => {
    if (typeof input !== 'string') return '[SANITIZED]';
    return encodeURIComponent(input).substring(0, 50) + '...';
};

export const validateMnemonic = (mnemonic) => {
  if (!mnemonic || typeof mnemonic !== 'string'){
    throw new Error('Invalid mnemonic format');
  } 

  const words = mnemonic.trim().toLowerCase().split(/\s+/);
  if (words.length < 12 || words.length > 24) {
    throw new Error('Mnemonic must contain between 12 and 24 words');
  }

  if(!ethers.utils.isValidMnemonic(mnemonic.trim().toLowerCase())) {
    throw new Error('Invalid mnemonic phrase');
  }
  return true;
}

export const validateAddress = (address) => {
  if (!address || !ethers.utils.isAddress(address)) {
    throw new Error('Invalid Ethereum address');
  }
    return true;
};