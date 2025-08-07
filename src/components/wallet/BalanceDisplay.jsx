import PropTypes from 'prop-types';

const BalanceDisplay = ({ balance, network, ethPrice, loading }) => {
  const displayToken = network === "ethereum" ? "ETH" : "SepoliaETH";
  const dollarEquivalent = (balance * ethPrice).toFixed(2);

  if (loading) {
    return (
      <div className="space-y-3 mb-6">
        <h1 className="text-white text-xl font-semibold">Available Balance</h1>

        {/* Futuristic shimmer loader */}
        <div className="animate-pulse">
          <div className="h-6 w-40 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-md mb-2"></div>
          <div className="h-4 w-24 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-6 transition-all duration-500">
      <h1 className="text-xl text-white font-semibold">Available Balance</h1>
      <p className="text-gray-300 text-lg font-medium">{balance.toFixed(4)} {displayToken}</p>
      <p className="text-gray-400">${dollarEquivalent}</p>
    </div>
  );
};

BalanceDisplay.propTypes = {
  balance: PropTypes.number.isRequired,
  network: PropTypes.string.isRequired,
  ethPrice: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default BalanceDisplay;
