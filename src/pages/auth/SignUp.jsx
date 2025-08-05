// src/pages/auth/SignUp.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from "../../assets/images/onfuse-logo.png";

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
    <div className='flex flex-col items-center justify-center mt-8'>
      <div className='flex flex-col items-center space-y-2'>
        <h1 className='text-primary-400 text-xl'>Let's get started</h1>
        <p className='text-primary-400'>Create Wallet</p>
      </div>
      <div className='space-y-6 flex flex-col items-center mt-8'>
        <img src={Logo} alt='Onfuse Logo' className='w-24' />
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            className='w-5 h-5'
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <p className='text-primary-400'>
            I agree to Onfuse's{' '}
            <a href='#' target='_blank' rel='noopener noreferrer'>
              <span className='text-blue-500 underline'>Terms of Use</span>
            </a>
          </p>
        </div>
        <div className='flex flex-col items-center space-y-5'>
          <button
            className='bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 text-primary-400 w-[250px] py-2 rounded-full hover:opacity-80 transition-opacity'
            onClick={handleCreateWallet}
          >
            Create a new wallet
          </button>
          <button
            className='border-2 border-primary-300 text-primary-400 w-[250px] py-2 rounded-full hover:bg-primary-300 hover:bg-opacity-10 transition-colors'
            onClick={handleImportWallet}
          >
            Import an existing wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
