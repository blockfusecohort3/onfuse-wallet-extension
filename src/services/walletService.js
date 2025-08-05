import { ethers } from 'ethers';
import { secureStorage } from '../utils/storage/secureStorage';
import { validateMnemonic, validateAddress } from '../utils/validation';
import { WALLET_CONSTANTS } from '../constants';
import blockies from 'ethereum-blockies';

// Use free public providers with fallbacks
const getProvider = (network) => {
  const providers = {
    ethereum: [
      'https://eth.public-rpc.com',
      'https://ethereum.publicnode.com',
      'https://rpc.ankr.com/eth'
    ],
    sepolia: [
      'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      'https://rpc.sepolia.org',
      'https://ethereum-sepolia.publicnode.com'
    ]
  };

  const rpcUrls = providers[network] || providers.sepolia;
  
  // Try providers in sequence
  for (const url of rpcUrls) {
    try {
      return new ethers.providers.JsonRpcProvider(url);
    } catch {
      continue;
    }
  }
  
  // Fallback to default provider
  return ethers.getDefaultProvider(network === 'ethereum' ? 'homestead' : 'sepolia');
};

export const generateMnemonic = () => {
  const randomEntropyBytes = ethers.utils.randomBytes(16);
  return ethers.utils.entropyToMnemonic(randomEntropyBytes);
};

export const createWallet = () => {
  const mnemonic = generateMnemonic();
  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
  
  return {
    mnemonic: mnemonic,
    address: hdNode.address,
    privateKey: hdNode.privateKey,
    publicKey: hdNode.publicKey
  };
};

export const importWallet = (mnemonic) => {
  validateMnemonic(mnemonic);
  
  const cleaned = mnemonic.trim().toLowerCase();
  const hdNode = ethers.utils.HDNode.fromMnemonic(cleaned);
  const wallet = hdNode.derivePath("m/44'/60'/0'/0/0");
  
  return {
    mnemonic: cleaned,
    address: wallet.address,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey
  };
};

export const saveWallet = async (walletData) => {
  try {
    secureStorage.setItem(WALLET_CONSTANTS.STORAGE_KEYS.MNEMONIC, walletData.mnemonic);
    secureStorage.setItem(WALLET_CONSTANTS.STORAGE_KEYS.ADDRESS, walletData.address);
    secureStorage.setItem(WALLET_CONSTANTS.STORAGE_KEYS.PRIVATE_KEY, walletData.privateKey);
    
    const accounts = [{
      name: "Account 1",
      publicAddress: walletData.address,
      profilePicUrl: blockies.create({ seed: walletData.address }).toDataURL()
    }];
    
    secureStorage.setItem(WALLET_CONSTANTS.STORAGE_KEYS.USER_ACCOUNTS, accounts);
    return true;
  } catch {
    throw new Error('Failed to save wallet data');
  }
};

export const getBalance = async (network, address) => {
  validateAddress(address);
  
  const provider = getProvider(network);
  
  try {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Balance fetch failed:', error.message);
    return '0.0';
  }
};

export const sendTransaction = async (amount, receiver) => {
  validateAddress(receiver);
  
  const privateKey = await secureStorage.getItem(WALLET_CONSTANTS.STORAGE_KEYS.PRIVATE_KEY);
  if (!privateKey) throw new Error('Private key not found');
  
  const provider = getProvider('sepolia');
  const wallet = new ethers.Wallet(privateKey, provider);

  const tx = {
    to: receiver,
    value: ethers.utils.parseEther(amount),
    gasLimit: 21000,
    gasPrice: await provider.getGasPrice(),
    nonce: await provider.getTransactionCount(wallet.address),
    chainId: 11155111
  };

  try {
    const txResponse = await wallet.sendTransaction(tx);
    const receipt = await txResponse.wait();
    return receipt;
  } catch (error) {
    throw new Error('Transaction failed: ' + error.message);
  }
};