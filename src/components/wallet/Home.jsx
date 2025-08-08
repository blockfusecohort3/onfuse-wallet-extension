import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEthereum } from "react-icons/fa6";
import { BsSendFill } from "react-icons/bs";
import { MdCallReceived } from "react-icons/md";

import { useWallet } from "../../contexts/WalletContext.jsx";
import { useWalletBalance } from "../../hooks/useWalletBalance";
import { NETWORK_COLORS } from "../../constants/index.js";
import NetworkSelector from "./NetworkSelector";
import BalanceDisplay from "./BalanceDisplay";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const Home = () => {
  const navigate = useNavigate();
  const { currentAccount, network, dispatch } = useWallet();
  const { balance, loading } = useWalletBalance();
  const [ethPrice, setEthPrice] = useState(0);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
      } catch {
        console.error("Price fetch failed");
      }
    };
    fetchEthPrice();
  }, []);

  const handleNetworkChange = (newNetwork) => {
    dispatch({ type: "SET_NETWORK", payload: newNetwork.name.toLowerCase() });
  };

  if (!currentAccount) {
    return <div className="text-center text-white">No account found</div>;
  }

  return (
    <motion.div
      className="flex flex-col items-center text-center text-white bg-gray-950 min-h-screen py-8"
      initial="initial"
      animate="animate"
    >
      <motion.div {...fadeIn(0)}>
        <BalanceDisplay
          balance={balance}
          network={network}
          ethPrice={ethPrice}
          loading={loading}
        />
      </motion.div>

      <motion.div {...fadeIn(0.2)}>
        <NetworkSelector
          selectedNetwork={{
            name: network,
            color: NETWORK_COLORS[network],
          }}
          onNetworkChange={handleNetworkChange}
        />
      </motion.div>

      <motion.div {...fadeIn(0.4)} className="flex space-x-10 mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center"
          onClick={() => navigate("/send-token")}
        >
          <div className="rounded-full border-2 border-primary-500 p-4 bg-gray-700 hover:scale-105 group transition-transform">
            <BsSendFill size={22} className="text-gray-200 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <span className="mt-2 text-gray-400 font-semibold">Send</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center"
          onClick={() => navigate("/receive-token")}
        >
        <div className="rounded-full border-2 border-primary-500 p-4 group bg-gray-700 hover:scale-105 transition-transform">
  <MdCallReceived
    size={22}
    className="text-gray-200 transform transition-transform duration-300 group-hover:translate-y-1 group-hover:-translate-x-1"
  />
</div>

          <span className="mt-2 text-gray-400 font-semibold">Receive</span>
        </motion.button>
      </motion.div>

      <motion.div
        {...fadeIn(0.6)}
        className="mt-7 w-[320px] bg-gradient-to-br mb-10 from-gray-800/70 to-gray-700/60 rounded-2xl border border-gray-500 shadow-xl backdrop-blur-lg"
      >
        <div className="flex items-center justify-between  px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="border-2 border-primary-500 rounded-full p-3 bg-gray-700">
              <FaEthereum className="text-primary-500 text-lg" />
            </span>
            <div className="flex flex-col items-start">
              <h1 className="text-white font-semibold">ETH</h1>
              <p className="text-gray-400 text-sm">Ethereum</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <h1 className="text-white font-semibold text-lg">
              {balance.toFixed(4)} ETH
            </h1>
            <p className="text-gray-400 text-sm">
              ${ethPrice ? (balance * ethPrice).toFixed(2) : "-"}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;