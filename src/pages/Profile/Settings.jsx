// src/pages/profile/Settings.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../contexts/WalletContext';
import { secureStorage } from '../../utils/storage/secureStorage';
import { WALLET_CONSTANTS } from '../../constants';
import { toast } from 'react-toastify';
import { 
  IoShieldCheckmark, 
  IoTrash, 
  IoLogOut, 
  IoInformationCircle,
  IoLockClosed 
} from 'react-icons/io5';

const Settings = () => {
  const navigate = useNavigate();
  const { currentAccount, dispatch } = useWallet();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: null });
    dispatch({ type: 'SET_ACCOUNTS', payload: [] });
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleDeleteWallet = () => {
    try {
      // Clear all wallet data
      Object.values(WALLET_CONSTANTS.STORAGE_KEYS).forEach(key => {
        secureStorage.removeItem(key);
      });
      
      dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: null });
      dispatch({ type: 'SET_ACCOUNTS', payload: [] });
      
      navigate('/');
      toast.success('Wallet deleted successfully');
    } catch (error) {
      toast.error('Failed to delete wallet');
    }
  };

  const settingsItems = [
    {
      icon: IoShieldCheckmark,
      title: 'Security',
      description: 'Manage your wallet security settings',
      action: () => navigate('/profile'),
      color: 'text-green-500'
    },
    {
      icon: IoLockClosed,
      title: 'Privacy',
      description: 'Control your privacy preferences',
      action: () => toast.info('Privacy settings coming soon'),
      color: 'text-blue-500'
    },
    {
      icon: IoInformationCircle,
      title: 'About',
      description: 'App version and information',
      action: () => toast.info('OnFuse Wallet v1.0.0'),
      color: 'text-gray-400'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl text-primary-400 font-semibold">Settings</h1>

      {/* Account Info */}
      {currentAccount && (
        <div className="bg-primary-900 rounded-lg p-4 border border-primary-800">
          <h2 className="text-primary-400 font-medium mb-3">Account</h2>
          <div className="flex items-center space-x-3">
            <img 
              src={currentAccount.profilePicUrl} 
              alt="Profile" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white font-medium">{currentAccount.name}</p>
              <p className="text-gray-400 text-sm">
                {currentAccount.publicAddress.slice(0, 6)}...{currentAccount.publicAddress.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Options */}
      <div className="space-y-3">
        {settingsItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full bg-primary-900 rounded-lg p-4 border border-primary-800 flex items-center space-x-3 hover:bg-primary-800 transition-colors"
          >
            <item.icon className={`text-xl ${item.color}`} />
            <div className="flex-1 text-left">
              <p className="text-white font-medium">{item.title}</p>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-900/20 rounded-lg p-4 border border-red-800">
        <h2 className="text-red-400 font-medium mb-3">Danger Zone</h2>
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg border border-orange-600 text-orange-400 hover:bg-orange-900/20"
          >
            <IoLogOut />
            <span>Logout</span>
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg border border-red-600 text-red-400 hover:bg-red-900/20"
          >
            <IoTrash />
            <span>Delete Wallet</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-primary-900 rounded-lg p-6 m-4 max-w-sm">
            <h3 className="text-white font-bold mb-2">Delete Wallet?</h3>
            <p className="text-gray-400 text-sm mb-4">
              This action cannot be undone. Make sure you have your recovery phrase saved.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-600 text-gray-400 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWallet}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
