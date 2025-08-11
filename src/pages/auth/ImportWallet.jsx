import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { importWallet, saveWallet } from '../../services/walletService';
import { useWallet } from '../../contexts/WalletContext';
import ActiveHeader from '../../components/layout/ActiveHeader';

const ImportWallet = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loadAccounts } = useWallet();

  const handleImport = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const walletData = importWallet(mnemonic); 
      await saveWallet(walletData);
      await loadAccounts();

      toast.success('Wallet imported successfully');
      navigate('/send-receive');
    } catch (err) {
      setError(err.message || 'Invalid recovery phrase');
      toast.error(err.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-950">
      <ActiveHeader/>
      <div className="flex gap-1 items-center">
        <h3 className="text-white text-center mt-14 text-[18px] w-full flex items-center justify-center">
          Import Secret Recovery Phrase
        </h3>
      </div>

      <h2 className="text-gray-300 mt-20 text-center">
        Enter your recovery phrase
      </h2>

      <form
        onSubmit={handleImport}
        className="h-auto mx-auto mt-8 text-center w-[325px] rounded-[10px] text-gray-300 text-sm p-4 bg-gray-900"
      >
        <p className="text-sm text-white mb-2">
          Enter your 12-word phrase. Separate each word with a space.
        </p>

        <motion.div
          key={error || 'no-error'}
          animate={error ? { x: [0, -15, 15, -15, 15, 0] } : {}}
          transition={{ duration: 0.6 }}
        >
          <textarea
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            rows={4}
            placeholder="e.g. abandon ability able about above absent absorb abstract absurd abuse access accident"
            className={`w-full text-gray-400 outline-none rounded-lg border-2 p-2 resize-none bg-gray-500/30 transition-all duration-300
              ${
                error
                  ? 'border-red-500'
                  : 'border-transparent focus:border-primary-500 focus:ring-primary-500'
              }`}
            required
          />
        </motion.div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}

          className="mt-6 text-white text-lg rounded-3xl px-2 py-1 w-[251px] bg-gradient-to-r from-primary-500 to-primary-800 hover:bg-opacity-75 disabled:opacity-50"
        >
          {loading ? 'Importing...' : 'Import Wallet'}
        </button>
      </form>
    </div>
  );
};

export default ImportWallet;
