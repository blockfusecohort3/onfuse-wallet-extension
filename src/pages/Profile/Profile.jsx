import { HiCurrencyDollar } from "react-icons/hi";
import { BsGlobeEuropeAfrica } from "react-icons/bs";
import { MdOutlineStickyNote2, MdKey, MdOutlineNavigateNext, MdLock } from "react-icons/md";
import { CgDarkMode } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../contexts/WalletContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const { lockWallet } = useWallet();

  const handleViewKey = () => {
    navigate('/private-key');
  };
  const handleShowPhrase = () => {
    navigate('/seed-phrase');
  };
  const handleCurrency = () => {
    navigate('/currency');
  };
  const handleTheme = () => {
    navigate('/theme');
  };
  const handleNetwork = () => {
    navigate('/network');
  };
  const handleLockWallet = () => {
    lockWallet();
    toast.success('Wallet locked');
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Card One */}
      <div className="w-[300px] h-[200px] mx-6 rounded-xl bg-slate-500 p-4">
        <h1 className="text-white">Preference</h1>
        <div className="flex flex-col">
          <button className="flex items-center justify-between w-full h-12 px-1 text-primary-400 text-sm" onClick={handleCurrency}>
            <div className="flex items-center gap-2">
              <HiCurrencyDollar className="text-xl" />
              Currency
            </div>
            <MdOutlineNavigateNext className="text-xl" />
          </button>
          <button className="flex items-center justify-between w-full h-12 px-1 text-primary-400 text-sm" onClick={handleNetwork}>
            <div className="flex items-center gap-2">
              <BsGlobeEuropeAfrica className="text-xl" />
              Network
            </div>
            <MdOutlineNavigateNext className="text-xl" />
          </button>
          <button className="flex items-center justify-between w-full h-12 px-1 text-primary-400 text-sm" onClick={handleTheme}>
            <div className="flex items-center gap-2">
              <CgDarkMode className="text-xl" />
              Theme
            </div>
            <MdOutlineNavigateNext className="text-xl" />
          </button>
        </div>
      </div>
      {/* Card two */}
      <div className="w-[300px] h-[200px] mx-6 rounded-xl bg-slate-500 p-4">
        <h1 className="text-white">Security</h1>
        <div className="flex flex-col gap-2">
          <button className="flex items-center justify-between w-full h-12 px-1 text-primary-400 text-sm" onClick={handleShowPhrase}>
            <div className="flex items-center gap-2">
              <MdOutlineStickyNote2 className="text-xl" />
              Show Recovery Phrase
            </div>
            <MdOutlineNavigateNext className="text-xl" />
          </button>
          <button className="flex items-center justify-between w-full h-12 px-1 text-primary-400 text-sm" onClick={handleViewKey}>
            <div className="flex items-center gap-2">
              <MdKey className="text-xl" />
              View Private Key
            </div>
            <MdOutlineNavigateNext className="text-xl" />
          </button>
          <button className="flex items-center justify-between w-full h-12 px-1 text-red-400 text-sm" onClick={handleLockWallet}>
            <div className="flex items-center gap-2">
              <MdLock className="text-xl" />
              Lock Wallet
            </div>
            <MdOutlineNavigateNext className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
