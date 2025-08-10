import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useWallet } from "../../contexts/WalletContext";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { authenticate, accounts } = useWallet();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    if (!password.trim()) {
      setError(true);
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const success = authenticate(password);
      if (success) {
        toast.success("Login successful");
        navigate("/send-receive");
      } else {
        setError(true);
        toast.error("Invalid password");
      }
    } catch {
      setError(true);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl text-primary-400 mb-4">No Wallet Found</h1>
        <Link to="/signup">
          <button className="bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 rounded-full py-2 px-6 text-primary-400">
            Create Wallet
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 flex flex-col items-center bg-gray-950">
      <div className="mt-8">
        <h1 className="text-2xl text-white ">Login</h1>
      </div>

      <div className="flex flex-col space-y-12 items-center justify-center mt-28">
        {/* Password input with shake animation */}
        <motion.div
          key={error ? "error" : "no-error"}
          animate={error ? { x: [0, -8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="relative flex items-center w-[300px]"
        >
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={`border-2 rounded-full px-4 text-primary-300 text-sm p-2 w-full pr-10 focus:outline-none bg-transparent transition-all duration-300
              ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            placeholder="Enter password"
            autoFocus
          />
          <div
            className="absolute right-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <IoEyeOffOutline className="text-white" />
            ) : (
              <IoEyeOutline className="text-white" />
            )}
          </div>
        </motion.div>

        {/* Unlock button */}
        <button
          className="w-[250px] bg-gradient-to-r from-primary-500 to-primary-800 rounded-full py-2 text-white disabled:opacity-50"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Unlocking..." : "Unlock"}
        </button>
   <Link to="/import-wallet">
           <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="border-2 border-primary-300   w-[250px] py-2 rounded-full bg-opacity-10 text-white transition-colors"
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        Import an Existing Wallet
      </motion.button>
   </Link>
      </div>
    </div>
  );
};

export default Login;
