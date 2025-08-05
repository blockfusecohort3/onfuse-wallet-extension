// src/pages/wallet/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEthereum } from "react-icons/fa6";
import { BsSendFill } from "react-icons/bs";
import { MdCallReceived } from "react-icons/md";

import { useWallet } from "../../contexts/WalletContext";
import { useWalletBalance } from "../../hooks/useWalletBalance";
import { NETWORK_COLORS } from "../../constants";
import NetworkSelector from "../../components/wallet/NetworkSelector";
import BalanceDisplay from "../../components/wallet/BalanceDisplay";

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
    <div className="flex flex-col items-center text-center mt-2 space-y-5">
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
          <div className="rounded-full border-2 border-primary-900 p-3">
            <BsSendFill size={20} className="text-primary-50" />
          </div>
          <span className="mt-1 text-white">Send</span>
        </button>
        
        <button
          className="flex flex-col items-center"
          onClick={() => navigate("/receive-token")}
        >
          <div className="rounded-full border-2 border-primary-900 p-3">
            <MdCallReceived size={20} className="text-primary-50" />
          </div>
          <span className="mt-1 text-white">Receive</span>
        </button>
      </div>

      <div className="bg-[#373073] w-[350px] h-screen rounded-2xl">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="border-2 border-primary-900 rounded-full p-1">
              <FaEthereum />
            </span>
            <div className="flex flex-col items-start">
              <h1 className="text-primary-400 font-semibold">ETH</h1>
              <p className="text-primary-400">Ethereum</p>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-primary-400 font-semibold">{balance.toFixed(4)} ETH</h1>
            <p className="text-primary-400">${(balance * ethPrice).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
