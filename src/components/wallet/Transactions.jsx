import { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { ethers } from 'ethers';
import { sanitizeForLogging } from '../../utils/validation';

const Transactions = () => {
  const { currentAccount, network } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentAccount?.publicAddress) {
      fetchTransactions();
    }
  }, [currentAccount, network]);

  const fetchTransactions = async () => {
    if (!currentAccount?.publicAddress) return;

    setLoading(true);
    setError(null);

    try {
      const provider = ethers.getDefaultProvider(
        network === 'ethereum' ? 'homestead' : 'sepolia'
      );

      // Get latest block number
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 1000); // Last 1000 blocks

      // Fetch transactions
      const txHistory = [];
      
      for (let i = latestBlock; i >= fromBlock && txHistory.length < 10; i--) {
        try {
          const block = await provider.getBlockWithTransactions(i);
          
          const userTxs = block.transactions.filter(tx => 
            tx.from?.toLowerCase() === currentAccount.publicAddress.toLowerCase() ||
            tx.to?.toLowerCase() === currentAccount.publicAddress.toLowerCase()
          );

          for (const tx of userTxs) {
            const receipt = await provider.getTransactionReceipt(tx.hash);
            txHistory.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: ethers.utils.formatEther(tx.value),
              timestamp: block.timestamp,
              status: receipt.status === 1 ? 'Success' : 'Failed',
              type: tx.from?.toLowerCase() === currentAccount.publicAddress.toLowerCase() ? 'Sent' : 'Received'
            });
          }
        } catch (blockError) {
          console.error('Block fetch error:', sanitizeForLogging(blockError.message));
        }
      }

      setTransactions(txHistory.slice(0, 10)); // Limit to 10 transactions
    } catch (error) {
      console.error('Transaction fetch error:', sanitizeForLogging(error.message));
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const truncateHash = (hash) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (!currentAccount) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-primary-400">No account connected</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-primary-400 font-semibold">Transactions</h1>
        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-primary-400">No transactions found</p>
          <p className="text-sm text-gray-500 mt-2">
            Transactions will appear here once you send or receive funds
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div
              key={index}
              className="bg-primary-900 rounded-lg p-4 border border-primary-800"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    tx.type === 'Sent'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {tx.type}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    tx.status === 'Success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {tx.status}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Hash:</span>
                  <span className="text-primary-400 font-mono">
                    {truncateHash(tx.hash)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-primary-400 font-semibold">
                    {parseFloat(tx.value).toFixed(4)} ETH
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-primary-400">
                    {formatDate(tx.timestamp)}
                  </span>
                </div>

                {tx.type === 'Sent' && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">To:</span>
                    <span className="text-primary-400 font-mono">
                      {truncateHash(tx.to)}
                    </span>
                  </div>
                )}

                {tx.type === 'Received' && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">From:</span>
                    <span className="text-primary-400 font-mono">
                      {truncateHash(tx.from)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {transactions.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Showing last {transactions.length} transactions
          </p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
