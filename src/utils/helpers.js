// // If you need to use dotenv, use the following import:
// import dotenv from "dotenv";
// dotenv.config();
import { ethers } from "ethers";
import { Alchemy, Network } from "alchemy-sdk";

export class helperMethods {
  static persistData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static retrieveData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  static removeStorageData() {
    localStorage.clear();
  }

  static async getAddresssFromSeedPhrase(seedPhrase, network) {
    const alchemy = new Alchemy({
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      network: Network[network.toUpperCase()],
    });

    return alchemy.wallets.getAddressFromSeedPhrase(seedPhrase);
  }
  static async sendTransaction(
    senderPrivateKey,
    recipientAddress,
    amount,
    networkChainId,
    providerUrl
  ) {
    const provider = new ethers.JsonRpcProvider(providerUrl, 11155111);
    const wallet = new ethers.Wallet(senderPrivateKey, provider);

    const transaction = {
      to: recipientAddress,
      value: ethers.parseEther(amount),
    };
    return await wallet.sendTransaction(transaction);
  }

  static async getBalance(address, networkChainId, providerUrl) {
    const provider = new ethers.JsonRpcProvider(providerUrl, networkChainId);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  static async replaceRandomMnemonics(arr) {
    if (arr.length !== 12) {
      console.error("The array must contain exactly 12 elements.");
      return false;
    }

    let newArray = [...arr];
    let replacedIndices = new Set();

    while (replacedIndices.size < 4) {
      let randomIndex = Math.floor(Math.random() * newArray.length);

      if (!replacedIndices.has(randomIndex)) {
        newArray[randomIndex] = "";
        replacedIndices.add(randomIndex);
      }
    }

    return newArray;
  }

  static async validateMnemonics(originalArray, userFilledArray) {
    for (let i = 0; i < originalArray.length; i++) {
      if (
        originalArray[i] != "" &&
        userFilledArray[i] != "" &&
        originalArray[i] == userFilledArray[i]
      ) {
        continue;
      }

      if (originalArray[i] !== userFilledArray[i]) {
        return false;
      }
    }

    return true;
  }

  async arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }
}
