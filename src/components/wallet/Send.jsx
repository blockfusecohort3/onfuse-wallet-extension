import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendTransaction } from "../../services/walletService";
import { validateAddress } from "../../utils/validation";

const Send = () => {
  const [loading, setLoading] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSend = async () => {
    setError("");
    
    try {
      validateAddress(inputAddress);
      if (!inputAmount || parseFloat(inputAmount) <= 0) {
        throw new Error("Invalid amount");
      }

      setLoading(true);
      await sendTransaction(inputAmount, inputAddress);
      toast.success("Transaction sent successfully");
      navigate("/send-receive");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-5 space-y-8 bg-white min-h-screen">
      <div className="space-y-2 w-72">
        <h1 className="text-gray-800 font-medium">Amount</h1>
        <input
          type="number"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          className="border-2 border-gray-300 bg-white rounded-full text-gray-800 text-sm p-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Input amount"
        />
      </div>

      <div className="space-y-2 w-72">
        <h1 className="text-gray-800 font-medium">To</h1>
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          className="border-2 border-gray-300 bg-white rounded-full text-gray-800 text-sm p-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter public address"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="space-x-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-32 border-2 border-gray-300 rounded-full py-2 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-32 bg-primary-500 hover:bg-primary-600 rounded-full py-2 text-white font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Send;
