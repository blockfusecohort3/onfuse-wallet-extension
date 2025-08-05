import { useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWallet } from '../../contexts/WalletContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loadAccounts } = useWallet();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      // Add password validation logic here
      await loadAccounts();
      navigate('/send-receive');
      toast.success('Login successful');
    } catch {
      toast.error('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="mt-8">
        <h1 className="text-xl text-primary-400">Login</h1>
      </div>

      <div className="flex flex-col space-y-12 items-center justify-center mt-28">
        <div className="relative flex items-center w-[300px]">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-300 bg-transparent rounded-full px-4 text-primary-400 text-sm p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
          <div className="absolute right-3 cursor-pointer" onClick={togglePasswordVisibility}>
            {showPassword ? <IoEyeOffOutline className="text-white" /> : <IoEyeOutline className="text-white" />}
          </div>
        </div>

        <button 
          className="w-[250px] bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 rounded-full py-2 text-primary-400 hover:opacity-70 disabled:opacity-50" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Unlocking...' : 'Unlock'}
        </button>
        
        <Link to="/signup">
          <p className="text-gray-400 underline">I don&apos;t have an account</p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
