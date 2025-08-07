import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEthereum } from "react-icons/fa6";
import { BsSendFill } from "react-icons/bs";
import { MdCallReceived } from "react-icons/md";

import { useWallet } from "../../contexts/WalletContext.jsx";
import { useWalletBalance } from "../../hooks/useWalletBalance";
import { NETWORK_COLORS } from "../../constants/index.js";
import NetworkSelector from "./NetworkSelector";
import BalanceDisplay from "./BalanceDisplay";

const Home = () => {
  const navigate = useNavigate();
  const { currentAccount, network, dispatch } = useWallet();
  const { balance, loading } = useWalletBalance();
  const [ethPrice, setEthPrice] = useState(0);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
      } catch {
        console.error('Price fetch failed');
      }
    };
    fetchEthPrice();
  }, []);

  const handleNetworkChange = (newNetwork) => {
    dispatch({ type: 'SET_NETWORK', payload: newNetwork.name.toLowerCase() });
  };

  if (!currentAccount) {
    return <div className="text-center text-white">No account found</div>;
  }

  return (
    <div className="flex flex-col items-center text-center mt-2 space-y-5 bg-white min-h-screen">
      <BalanceDisplay 
        balance={balance}
        network={network}
        ethPrice={ethPrice}
        loading={loading}
      />
      
      <NetworkSelector 
        selectedNetwork={{ name: network, color: NETWORK_COLORS[network] }}
        onNetworkChange={handleNetworkChange}
      />

      <div className="flex space-x-8">
        <button
          className="flex flex-col items-center"
          onClick={() => navigate("/send-token")}
        >
          <div className="rounded-full border-2 border-primary-500 p-3 hover:bg-primary-50 transition-colors">
            <BsSendFill size={20} className="text-primary-500" />
          </div>
          <span className="mt-1 text-gray-700 font-medium">Send</span>
        </button>
        
        <button
          className="flex flex-col items-center"
          onClick={() => navigate("/receive-token")}
        >
          <div className="rounded-full border-2 border-primary-500 p-3 hover:bg-primary-50 transition-colors">
            <MdCallReceived size={20} className="text-primary-500" />
          </div>
          <span className="mt-1 text-gray-700 font-medium">Receive</span>
        </button>
      </div>

      <div className="bg-gray-50 w-[350px] h-screen rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="border-2 border-primary-500 rounded-full p-2 bg-primary-50">
              <FaEthereum className="text-primary-500" />
            </span>
            <div className="flex flex-col items-start">
              <h1 className="text-gray-800 font-semibold">ETH</h1>
              <p className="text-gray-600">Ethereum</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <h1 className="text-gray-800 font-semibold">{balance.toFixed(4)} ETH</h1>
            <p className="text-gray-600">${(balance * ethPrice).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
