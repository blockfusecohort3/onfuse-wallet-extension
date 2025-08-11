import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { useSecureForm } from "../../hooks/useSecureForm";
import { createWallet, saveWallet } from "../../services/walletService";
import { useWallet } from "../../contexts/WalletContext";
import { validatePassword } from "../../utils/validation/passwordValidation";
import PasswordInput from "../../components/forms/PasswordInput";
import ActiveHeader from "../../components/layout/ActiveHeader";

const CreatePassword = () => {
  const navigate = useNavigate();
  const { savePassword } = useWallet();
  const { values, errors, loading, setValue, setError, setLoading } = useSecureForm({
    password: "",
    confirmPassword: "",
    isChecked: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    localStorage.setItem("password", values.password);

    setLoading(true);
    try {
      const walletData = createWallet();
      console.log("userAddress:", walletData);
      await saveWallet(walletData);
      savePassword(values.password);

      navigate("/secret-recovery", { state: { mnemonic: walletData.mnemonic } });
      toast.success("Wallet created successfully");
    } catch {
      setError("general", "Failed to create wallet");
      toast.error("Wallet creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-950 py-8 space-y-6 min-h-screen">
      <ActiveHeader />
      <div className="text-center">
        <h1 className="text-xl mb-2 text-white mt-14 font-semibold">Create Password</h1>
        <p className="text-sm m-5 text-gray-300">
          This password will unlock your Onfuse wallet only on this device.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 w-[300px]">
        <PasswordInput
          value={values.password}
          onChange={(value) => setValue("password", value)}
          placeholder="New Password (8 characters min)"
          error={errors.password}
          showValidation={true}
        />

        <PasswordInput
          value={values.confirmPassword}
          onChange={(value) => setValue("confirmPassword", value)}
          placeholder="Confirm Password"
          error={errors.confirmPassword}
        />

        <motion.div
          key={errors.isChecked || "checkbox"}
          animate={errors.isChecked ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center space-x-2"
        >
          <input
            type="checkbox"
            checked={values.isChecked}
            onChange={(e) => setValue("isChecked", e.target.checked)}
            className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
          <p className="text-sm py-4 text-gray-300">
            I understand that Onfuse cannot recover this password for me.
          </p>
        </motion.div>

        {errors.general && <p className="text-red-500 pt-2 text-sm">{errors.general}</p>}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.96 } : {}}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-800 rounded-full py-3 text-white disabled:opacity-50 flex justify-center items-center font-medium transition-colors"
        >
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
            />
          ) : (
            "Create Wallet"
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default CreatePassword;
