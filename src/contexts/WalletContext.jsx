import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { secureStorage } from '../utils/storage/secureStorage';
import { WALLET_CONSTANTS } from '../constants';
import PropTypes from 'prop-types';

const WalletContext = createContext();

const initialState = {
    accounts: [],
    currentAccount: null,
    balance: 0,
    network: 'ethereum',
    loading: true,
    error: null
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
      case 'CLEAR_ERROR':
        return { ...state, error: null };
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
      }
    } catch {
      setError('Failed to load accounts');
    }
  }, [setError]);

  // Auto-load accounts on initialization
  useEffect(() => {
    const initializeWallet = async () => {
      setLoading(true);
      try {
        loadAccounts();
      } finally {
        setLoading(false);
      }
    };
    
    initializeWallet();
  }, [loadAccounts, setLoading]);

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    loadAccounts,
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
