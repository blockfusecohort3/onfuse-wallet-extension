import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { helperMethods } from "../../utils/helpers";
import { decryptData } from "../../utils/storage/secureStorage";
import { defaultNetworks } from "../../utils/networkconfig/network.config";
import { validateAddress } from "../../utils/validation";

const Send = () => {
  const [loading, setLoading] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [error, setError] = useState({ address: "", amount: "" });

  const navigate = useNavigate();

  const privateKey = decryptData(localStorage.getItem("privateKey"));
  const networkChainId = defaultNetworks.sepolia.chainId;
  const rpcUrl = defaultNetworks.sepolia.rpcUrl;

  useEffect(() => {
    if (inputAddress && !validateAddress(inputAddress)) {
      setError((prev) => ({ ...prev, address: "Invalid address format" }));
    } else {
      setError((prev) => ({ ...prev, address: "" }));
    }

    if (inputAmount && parseFloat(inputAmount) <= 0) {
      setError((prev) => ({ ...prev, amount: "Amount must be greater than 0" }));
    } else {
      setError((prev) => ({ ...prev, amount: "" }));
    }
  }, [inputAddress, inputAmount]);

  const handleSend = async () => {
    if (error.address || error.amount || !inputAddress || !inputAmount) {
      toast.error("Please fix the input errors before sending.");
      return;
    }

    try {
      setLoading(true);
      await helperMethods.sendTransaction(privateKey, networkChainId, rpcUrl, inputAddress, inputAmount);
      toast.success("Transaction sent successfully");
      navigate("/send-receive");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputBaseStyles = "rounded-full text-sm p-3 w-full focus:outline-none focus:ring-2 transition-all";
  const isFormValid = !error.address && !error.amount && inputAddress && inputAmount;

  return (
    <div className="flex flex-col items-center py-8 space-y-8 bg-gray-950 min-h-screen">
      <div className="space-y-2 w-72">
        <h1 className="text-white font-medium">Amount</h1>
        <input
          type="number"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          className={`${inputBaseStyles} border ${error.amount ? "border-red-500 ring-red-500" : "border-gray-800 focus:ring-primary-500"} bg-white/10 text-gray-300`}
          placeholder="Input amount"
        />
        {error.amount && <p className="text-red-500 text-xs">{error.amount}</p>}
      </div>

      <div className="space-y-2 w-72">
        <h1 className="text-white font-medium">To</h1>
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          className={`${inputBaseStyles} border ${error.address ? "border-red-500 ring-red-500" : "border-gray-800 focus:ring-primary-500"} bg-white/10 text-gray-300`}
          placeholder="Enter public address"
        />
        {error.address && <p className="text-red-500 text-xs">{error.address}</p>}
      </div>

      <div className="space-x-6 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="w-32 border-2 border-gray-300 rounded-full py-2 text-gray-700 relative overflow-hidden transition-all duration-300 group hover:border-primary-500 hover:shadow-lg hover:shadow-primary-300/30"
        >
          <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 text-primary-500">
            Cancel
          </span>
          <span className="absolute inset-0 bg-primary-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></span>
        </button>

        <button
          onClick={handleSend}
          disabled={loading || !isFormValid}
          className={`w-32 rounded-full py-2 font-medium transition-all duration-300
            ${loading || !isFormValid
              ? "bg-primary-300 text-white cursor-not-allowed opacity-50"
              : "bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-lg"}
          `}
        >
          {loading ? 'Processing...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Send;
