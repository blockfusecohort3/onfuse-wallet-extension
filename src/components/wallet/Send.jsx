import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { validateAddress } from "../../utils/validation";
import { decryptData } from "../../utils/storage/secureStorage";
import { defaultNetworks, NETWORKS } from "../../utils/networkconfig/network.config";
import { sendTransaction } from "../../services/walletService";

const shakeAnimation = {
  x: [-6, 6, -6, 6, 0],
  transition: { duration: 0.35 },
};

const Send = () => {
  const [loading, setLoading] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [error, setError] = useState({ address: "", amount: "" });
  const [generalError, setGeneralError] = useState("");

  const navigate = useNavigate();
  const addressRef = useRef(null);
  const amountRef = useRef(null);
  const [shakeField, setShakeField] = useState("");

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

  const triggerShake = (field) => {
    setShakeField(field);
    setTimeout(() => setShakeField(""), 500);
  };

  const handleSend = async () => {
    setError({ address: "", amount: "" });
    setGeneralError("");

    if (!inputAddress.trim()) {
      setError((prev) => ({ ...prev, address: "Please enter a recipient address" }));
      triggerShake("address");
      addressRef.current?.focus();
      return;
    }
    try {
      validateAddress(inputAddress.trim());
    } catch {
      setError((prev) => ({ ...prev, address: "Invalid recipient address format" }));
      triggerShake("address");
      addressRef.current?.focus();
      return;
    }

    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      setError((prev) => ({ ...prev, amount: "Please enter a valid amount greater than 0" }));
      triggerShake("amount");
      amountRef.current?.focus();
      return;
    }
    if (isNaN(inputAmount)) {
      setError((prev) => ({ ...prev, amount: "Invalid amount. Please enter a number" }));
      triggerShake("amount");
      amountRef.current?.focus();
      return;
    }

    try {
      const privateKey = decryptData(localStorage.getItem("privateKey"));
      if (!privateKey) throw new Error("Private key not found. Please re-import your wallet.");

      const networkChainId = defaultNetworks[NETWORKS.SEPOLIA].chainId;
      const network = NETWORKS.SEPOLIA;

      setLoading(true);

      await sendTransaction(
        privateKey,
        inputAddress.trim(),
        inputAmount,
        networkChainId,
        network
      );

      toast.success("Transaction sent successfully!");
      navigate("/send-receive");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setGeneralError(errorMessage);
      toast.error(errorMessage);
      console.error("Transaction error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-8 space-y-8 bg-gray-950 min-h-screen">
      <div className="space-y-2 w-72">
        <h1 className="text-white font-medium">Amount</h1>
        <motion.input
          ref={amountRef}
          type="number"
          value={inputAmount}
          animate={shakeField === "amount" ? shakeAnimation : {}}
          onChange={(e) => {
            setInputAmount(e.target.value);
            setError((prev) => ({ ...prev, amount: "" }));
          }}
          className={`bg-white/10 rounded-full text-gray-300 text-sm p-3 w-full focus:outline-none transition-all duration-200 ease-in-out 
            ${error.amount ? "border-2 border-red-500" : "border border-transparent"}
          `}
          placeholder="Input amount (ETH)"
          step="0.001"
          min="0"
        />
        {error.amount && <p className="text-red-500 text-xs">{error.amount}</p>}
      </div>

      <div className="space-y-2 w-72">
        <h1 className="text-white font-medium">To</h1>
        <motion.input
          ref={addressRef}
          type="text"
          value={inputAddress}
          animate={shakeField === "address" ? shakeAnimation : {}}
          onChange={(e) => {
            setInputAddress(e.target.value);
            setError((prev) => ({ ...prev, address: "" }));
          }}
          className={`bg-white/10 rounded-full text-gray-300 text-sm p-3 w-full focus:outline-none transition-all duration-200 ease-in-out 
            ${error.address ? "border-2 border-red-500" : "border border-transparent"}
          `}
          placeholder="Enter recipient address (0x...)"
        />
        {error.address && <p className="text-red-500 text-xs">{error.address}</p>}
      </div>

      {generalError && (
        <div className="w-72 p-3 bg-red-50/10 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{generalError}</p>
        </div>
      )}

      <div className="space-x-6 flex">
        <motion.button
          type="button"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          disabled={loading}
          className="w-32 border-2 border-gray-300 rounded-full py-2 text-primary-500 hover:bg-gray-50/10 transition-colors disabled:opacity-50"
        >
          Cancel
        </motion.button>

        <motion.button
          type="button"
          onClick={handleSend}
          disabled={loading}
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.96 } : {}}
          className="w-32 bg-gradient-to-r from-primary-500 to-primary-800 rounded-full py-2 text-white font-medium transition-colors disabled:opacity-50 flex justify-center items-center"
        >
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }} // faster spinner
            />
          ) : (
            "Send"
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default Send;
