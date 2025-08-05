// src/services/walletService.js
import { ethers } from 'ethers';
import { secureStorage } from '../utils/storage/secureStorage';
import { validateMnemonic, validateAddress } from '../utils/validation';
import { WALLET_CONSTANTS } from '../constants';
import blockies from 'ethereum-blockies';

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

export const saveWallet = (walletData) => {
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
  
  const provider = ethers.getDefaultProvider(
    network === WALLET_CONSTANTS.NETWORKS.ETHEREUM ? 'homestead' : 'sepolia'
  );
  
  try {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch {
    throw new Error('Failed to fetch balance');
  }
};

export const sendTransaction = async (amount, receiver) => {
  validateAddress(receiver);
  
  const privateKey = secureStorage.getItem(WALLET_CONSTANTS.STORAGE_KEYS.PRIVATE_KEY);
  if (!privateKey) throw new Error('Private key not found');
  
  const provider = new ethers.providers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/2fa89a3017a64226a09f8d4ad65aaf83"
  );
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
  } catch {
    throw new Error('Transaction failed');
  }
};
