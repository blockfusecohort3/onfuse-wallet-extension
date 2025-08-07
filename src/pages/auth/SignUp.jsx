import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from "../../assets/images/onfuse-logo.png";
import { motion } from "framer-motion";

const SignUp = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate(); 

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleCreateWallet = () => {
    if (isChecked) {
      navigate('/create-password'); 
    } else {
      toast.error('Please agree to the terms first.');
    }
  };

  const handleImportWallet = () => {
    if (isChecked) {
      navigate('/import-wallet'); 
    } else {
      toast.error('Please agree to the terms first.');
    }
  };

  return (
   
<motion.div
  className="flex flex-col items-center bg-gray-900 h-[600px] p-2 justify-center mt-8"
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  <motion.div
    className="flex flex-col items-center space-y-2"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h1 className="text-primary-200 text-xl">Let&apos;s get started</h1>
    <p className="text-primary-200">Create Wallet</p>
  </motion.div>

  <motion.div
    className="space-y-6 flex flex-col items-center mt-8"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    <motion.img
      src={Logo}
      alt="Onfuse Logo"
      className="w-24"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    />

    <motion.div
      className="flex items-center space-x-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <input
        type="checkbox"
        className="w-5 h-5"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <p className="text-primary-400">
        I agree to Onfuse&apos;s{' '}
        <span className="text-blue-500 underline">Terms of Use</span>
      </p>
    </motion.div>

    <motion.div
      className="flex flex-col items-center space-y-5"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.7,
          },
        },
      }}
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="text-primary-100 bg-gradient-to-r from-primary-800 via-primary-500 to-primary-800 w-[250px] py-2 rounded-full hover:opacity-80 transition-opacity"
        onClick={handleCreateWallet}
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        Create a new wallet
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="border-2 border-primary-300 bg-primary-100 text-primary-800 w-[250px] py-2 rounded-full hover:bg-primary-300 hover:bg-opacity-10 hover:text-primary-100 transition-colors"
        onClick={handleImportWallet}
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        Import an existing wallet
      </motion.button>
    </motion.div>
  </motion.div>
</motion.div>
  );
};

export default SignUp;
