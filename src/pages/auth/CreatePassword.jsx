import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSecureForm } from "../../hooks/useSecureForm";
import { createWallet, saveWallet } from "../../services/walletService";
import { useWallet } from "../../contexts/WalletContext";
import { validatePassword } from "../../utils/validation/passwordValidation";
import PasswordInput from "../../components/forms/PasswordInput";
import Button from "../../components/common/Button";

const CreatePassword = () => {
  const navigate = useNavigate();
  const { loadAccounts } = useWallet();
  const { values, errors, loading, setValue, setError, setLoading } = useSecureForm({
    password: "",
    confirmPassword: "",
    isChecked: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password strength
    const passwordValidation = validatePassword(values.password);
    if (!passwordValidation.isValid) {
      setError('password', passwordValidation.errors[0]);
      return;
    }
    
    if (values.password !== values.confirmPassword) {
      setError('confirmPassword', 'Passwords do not match');
      return;
    }
    
    if (!values.isChecked) {
      setError('isChecked', 'Please agree to the terms');
      return;
    }

    setLoading(true);
    try {
      const walletData = createWallet();
      await saveWallet(walletData);
      await loadAccounts();
      
      navigate("/secret-recovery", { state: { mnemonic: walletData.mnemonic } });
      toast.success('Wallet created successfully');
    } catch {
      setError('general', 'Failed to create wallet');
      toast.error('Wallet creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-5 space-y-6 bg-white min-h-screen">
      <div className="text-center">
        <h1 className="text-xl mb-2 text-gray-800 font-semibold">Create Password</h1>
        <p className="text-sm m-5 text-gray-600">
          This password will unlock your Onfuse wallet only on this device.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 w-[300px]">
        <PasswordInput
          value={values.password}
          onChange={(value) => setValue('password', value)}
          placeholder="New Password (8 characters min)"
          error={errors.password}
          showValidation={true}
        />
        
        <PasswordInput
          value={values.confirmPassword}
          onChange={(value) => setValue('confirmPassword', value)}
          placeholder="Confirm Password"
          error={errors.confirmPassword}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={values.isChecked}
            onChange={(e) => setValue('isChecked', e.target.checked)}
            className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
          <p className="text-sm text-gray-700">
            I understand that Onfuse cannot recover this password for me.
          </p>
        </div>
        
        {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

        <Button
          type="submit"
          loading={loading}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-full font-medium transition-colors"
        >
          Create Wallet
        </Button>
      </form>
    </div>
  );
};

export default CreatePassword;
