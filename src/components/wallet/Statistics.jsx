// src/pages/wallet/Statistics.jsx
import { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { FaEthereum, FaArrowUp, FaArrowDown } from 'react-icons/fa6';

const Statistics = () => {
  const { currentAccount, network } = useWallet();
  const { balance } = useWalletBalance();
  const [ethPrice, setEthPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    const fetchEthData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true"
        );
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
        setPriceChange(data.ethereum.usd_24h_change);
      } catch (error) {
        console.error('Price fetch failed');
      }
    };
    fetchEthData();
  }, []);

  const portfolioValue = (balance * ethPrice).toFixed(2);
  const portfolioChange = (balance * ethPrice * priceChange / 100).toFixed(2);

  if (!currentAccount) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-primary-400">No account connected</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl text-primary-400 font-semibold">Portfolio Statistics</h1>
      
      {/* Portfolio Overview */}
      <div className="bg-primary-900 rounded-lg p-4 border border-primary-800">
        <h2 className="text-primary-400 font-medium mb-3">Total Portfolio Value</h2>
        <div className="space-y-2">
          <p className="text-2xl text-white font-bold">${portfolioValue}</p>
          <div className="flex items-center space-x-2">
            {priceChange >= 0 ? (
              <FaArrowUp className="text-green-500" />
            ) : (
              <FaArrowDown className="text-red-500" />
            )}
            <span className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${Math.abs(portfolioChange)} ({Math.abs(priceChange).toFixed(2)}%)
            </span>
            <span className="text-gray-400 text-sm">24h</span>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="bg-primary-900 rounded-lg p-4 border border-primary-800">
        <h2 className="text-primary-400 font-medium mb-3">Holdings</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-800 rounded-full p-2">
              <FaEthereum className="text-primary-400" />
            </div>
            <div>
              <p className="text-white font-medium">Ethereum</p>
              <p className="text-gray-400 text-sm">{network.toUpperCase()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">{balance.toFixed(4)} ETH</p>
            <p className="text-gray-400 text-sm">${(balance * ethPrice).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Price Info */}
      <div className="bg-primary-900 rounded-lg p-4 border border-primary-800">
        <h2 className="text-primary-400 font-medium mb-3">Market Data</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">ETH Price</span>
            <span className="text-white">${ethPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">24h Change</span>
            <span className={priceChange >= 0 ? 'text-green-500' : 'text-red-500'}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Network</span>
            <span className="text-white capitalize">{network}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
