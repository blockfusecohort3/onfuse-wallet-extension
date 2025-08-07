const NETWORKS = Object.freeze({
     MAINNET: "mainnet",
    SEPOLIA: "sepolia",
    BSC: "bsc",
    SOLANA: "solana",
    POLYGON: "polygon",
})

 const defaultNetworks = Object.freeze({
  [NETWORKS.MAINNET]: Object.freeze({
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/1cef973dff844ba09dea342050cd5967",
    chainId: 1,
    symbol: "Ξ",
    ticker: "ETH",
    explorer: "https://etherscan.io",
  }),
  [NETWORKS.POLYGON]: Object.freeze({
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
    chainId: 137,
    symbol: "MATIC",
    ticker: "MATIC",
    explorer: "https://polygonscan.com",
  }),
  [NETWORKS.BSC]: Object.freeze({
    name: "Binance Smart Chain",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    chainId: 56,
    symbol: "BNB",
    ticker: "BNB",
    explorer: "https://bscscan.com",
  }),
  [NETWORKS.SEPOLIA]: Object.freeze({
    name: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/1cef973dff844ba09dea342050cd5967",
    chainId: 11155111,
    symbol: "Ξ",
    ticker: "SepoliaETH",
    explorer: "https://sepolia.etherscan.io",
  }),

  

});


const getNetworkByChainId = (chainId) => {
  return Object.values(defaultNetworks).find(network => network.chainId === chainId);
};

const getNetworksByType = (type) => {
  return Object.values(defaultNetworks).filter(network => network.type === type);
};


export {
  NETWORKS,
  defaultNetworks,
  getNetworkByChainId,
  getNetworksByType
};