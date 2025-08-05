// src/hooks/useWalletBalance.js
import { useState, useEffect, useCallback } from 'react';
import { getBalance } from '../services/walletService';
import { useWallet } from '../contexts/WalletContext';

export const useWalletBalance = () => {
  const { currentAccount, network } = useWallet();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!currentAccount?.publicAddress) return;
    
    setLoading(true);
    try {
      const balanceResult = await getBalance(network, currentAccount.publicAddress);
      setBalance(parseFloat(balanceResult));
    } catch {
      console.error('Balance fetch failed');
    } finally {
      setLoading(false);
    }
  }, [currentAccount, network]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, refetch: fetchBalance };
};
