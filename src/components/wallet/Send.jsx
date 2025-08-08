import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateAddress } from "../../utils/validation";
import { decryptData } from "../../utils/storage/secureStorage";
import { defaultNetworks } from "../../utils/networkconfig/network.config";
import { helperMethods } from "../../utils/helpers";

const Send = () => {
  const [loading, setLoading] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getErrorMessage = (error) => {
    const message = error.message || error.toString();
    
    if (message.includes("insufficient funds")) {
      return "Insufficient funds. Please check your balance or get testnet ETH from a faucet.";
    }
    if (message.includes("invalid address")) {
      return "Invalid recipient address. Please check the address format.";
    }
    if (message.includes("network")) {
      return "Network error. Please check your connection and try again.";
    }
    if (message.includes("gas")) {
      return "Transaction failed due to gas issues. Please try again.";
    }
    if (message.includes("nonce")) {
      return "Transaction nonce error. Please try again.";
    }
    
    return message.length > 100 ? "Transaction failed. Please try again." : message;
  };

  const handleSend = async () => {
    setError("");

    try {
      // Validation
      if (!inputAddress.trim()) {
        throw new Error("Please enter a recipient address");
      }
      if (!inputAmount || parseFloat(inputAmount) <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }

      validateAddress(inputAddress);

      const privateKey = decryptData(localStorage.getItem("privateKey"));
      if (!privateKey) {
        throw new Error("Private key not found. Please re-import your wallet.");
      }

      const networkChainId = defaultNetworks.sepolia.chainId;
      const rpcUrl = defaultNetworks.sepolia.rpcUrl;

      setLoading(true);
      
      await helperMethods.sendTransaction(
        privateKey, 
        inputAddress.trim(), 
        inputAmount, 
        networkChainId, 
        rpcUrl
      );
      
      toast.success("Transaction sent successfully!");
      navigate("/send-receive");
      
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Transaction error:", error);
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
          onChange={(e) => {
            setInputAmount(e.target.value);
            setError("");
          }}
          className="border-2 border-gray-300 bg-white rounded-full text-gray-800 text-sm p-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Input amount (ETH)"
          step="0.001"
          min="0"
        />
      </div>

      <div className="space-y-2 w-72">
        <h1 className="text-gray-800 font-medium">To</h1>
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => {
            setInputAddress(e.target.value);
            setError("");
          }}
          className="border-2 border-gray-300 bg-white rounded-full text-gray-800 text-sm p-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter recipient address (0x...)"
        />
      </div>

      {error && (
        <div className="w-72 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-x-6">
        <button
          onClick={() => navigate(-1)}
          className="w-32 border-2 border-gray-300 rounded-full py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSend}
          disabled={loading || !inputAddress.trim() || !inputAmount}
          className="w-32 bg-primary-500 hover:bg-primary-600 rounded-full py-2 text-white font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Send;
