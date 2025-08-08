import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { secureStorage } from '../utils/storage/secureStorage';
import { WALLET_CONSTANTS } from '../constants';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';

const WalletContext = createContext();

const initialState = {
    accounts: [],
    currentAccount: null,
    balance: 0,
    network: 'ethereum',
    loading: true,
    error: null,
    isAuthenticated: false
};

const walletReducer = (state, action) => {
    switch (action.type) {
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'SET_ERROR':
        return { ...state, error: action.payload, loading: false };
      case 'SET_ACCOUNTS':
        return { ...state, accounts: action.payload };
      case 'SET_CURRENT_ACCOUNT':
        return { ...state, currentAccount: action.payload };
      case 'SET_BALANCE':
        return { ...state, balance: action.payload };
      case 'SET_NETWORK':
        return { ...state, network: action.payload };
      case 'SET_AUTHENTICATED':
        return { ...state, isAuthenticated: action.payload };
      case 'CLEAR_ERROR':
        return { ...state, error: null };
      case 'LOCK_WALLET':
        return { ...state, isAuthenticated: false, currentAccount: null };
      default:
        return state;
    }
  };

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
      throw new Error('useWallet must be used within WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const setLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const loadAccounts = useCallback(() => {
    try {
      const accounts = secureStorage.getItem(WALLET_CONSTANTS.STORAGE_KEYS.USER_ACCOUNTS);
      if (accounts) {
        dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
        dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: accounts[0] });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      }
    } catch {
      setError('Failed to load accounts');
    }
  }, [setError]);

  const authenticate = useCallback((password) => {
    try {
      const storedHash = secureStorage.getItem('passwordHash');
      if (!storedHash) return false;
      
      const hash = CryptoJS.SHA256(password).toString();
      if (hash === storedHash) {
        loadAccounts();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [loadAccounts]);

  const lockWallet = useCallback(() => {
    dispatch({ type: 'LOCK_WALLET' });
  }, []);

  const savePassword = useCallback((password) => {
    const hash = CryptoJS.SHA256(password).toString();
    secureStorage.setItem('passwordHash', hash);
  }, []);

  // Auto-load accounts on initialization
  useEffect(() => {
    const initializeWallet = async () => {
      setLoading(true);
      try {
        const accounts = secureStorage.getItem(WALLET_CONSTANTS.STORAGE_KEYS.USER_ACCOUNTS);
        const passwordHash = secureStorage.getItem('passwordHash');
        
        if (accounts && passwordHash) {
          dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
          // Don't auto-authenticate, require password
        }
      } finally {
        setLoading(false);
      }
    };
    
    initializeWallet();
  }, [setLoading]);

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    loadAccounts,
    authenticate,
    lockWallet,
    savePassword,
    dispatch
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

WalletProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
