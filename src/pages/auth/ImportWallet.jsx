import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { importWallet, saveWallet } from '../../services/walletService';
import { useWallet } from '../../contexts/WalletContext';
import { validatePassword } from '../../utils/validation/passwordValidation';
import PasswordInput from '../../components/forms/PasswordInput';

const ImportWallet = () => {
  const [step, setStep] = useState(1);
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loadAccounts, savePassword } = useWallet();

  const handleMnemonicSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      importWallet(mnemonic);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Invalid recovery phrase');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.errors[0]);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const walletData = importWallet(mnemonic);
      await saveWallet(walletData);
      savePassword(password);
      loadAccounts();

      toast.success('Wallet imported successfully');
      navigate('/send-receive');
    } catch (err) {
      setError(err.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-950">
      <div className="flex gap-1 items-center">
        <h3 className="text-white text-center text-[18px] w-full flex items-center justify-center">
          {step === 1 ? 'Import Secret Recovery Phrase' : 'Create Password'}
        </h3>
      </div>

      {step === 1 ? (
        <>
          <h2 className="text-gray-300 mt-20 text-center">
            Enter your recovery phrase
          </h2>

          <form
            onSubmit={handleMnemonicSubmit}
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
              className="mt-6 text-white text-lg rounded-3xl px-2 py-1 w-[251px] bg-gradient-to-r from-primary-500 to-primary-800 hover:bg-opacity-75"
            >
              Next
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-gray-300 mt-20 text-center">
            Create a password for your wallet
          </h2>

          <form
            onSubmit={handlePasswordSubmit}
            className="h-auto mx-auto mt-8 text-center w-[325px] rounded-[10px] text-gray-300 text-sm p-4 bg-gray-900 space-y-4"
          >
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="New Password (8 characters min)"
              error=""
              showValidation={true}
            />

            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm Password"
              error=""
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 text-gray-400 border border-gray-600 rounded-full py-2"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 text-white bg-gradient-to-r from-primary-500 to-primary-800 rounded-full py-2 disabled:opacity-50"
              >
                {loading ? 'Importing...' : 'Import Wallet'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ImportWallet;
