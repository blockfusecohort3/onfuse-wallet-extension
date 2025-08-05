import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { importWallet, saveWallet } from '../../services/walletService';
import { useWallet } from '../../contexts/WalletContext';

const ImportWallet = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loadAccounts } = useWallet();

  const handleImport = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const walletData = importWallet(mnemonic);
      await saveWallet(walletData);
      await loadAccounts();
      
      navigate('/send-receive');
      toast.success('Wallet imported successfully');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex gap-1 items-center">
        <h3 className="text-white text-center text-[18px] w-full flex items-center justify-center">
          Import Secret Recovery Phrase
        </h3>
      </div>

      <h2 className="text-[#FF2CDF] mt-20 text-center">
        Enter your recovery phrase
      </h2>

      <form
        onSubmit={handleImport}
        className="h-auto mx-auto mt-8 text-center w-[319px] rounded-[10px] bg-[#5865F2] p-4"
      >
        <p className="text-sm text-white mb-2">
          Enter your 12-word phrase. Separate each word with a space.
        </p>

        <textarea
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          rows={4}
          placeholder="e.g. abandon ability able about above absent absorb abstract absurd abuse access accident"
          className="w-full text-black rounded-lg p-2 resize-none"
          required
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 text-white text-lg rounded-3xl px-2 py-1 w-[251px] bg-gradient-to-r from-primary-50 to-primary-100 hover:bg-opacity-75 disabled:opacity-50"
        >
          {loading ? 'Importing...' : 'Import Wallet'}
        </button>
      </form>
    </div>
  );
};

export default ImportWallet;
