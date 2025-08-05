import PropTypes from 'prop-types';

const BalanceDisplay = ({ balance, network, ethPrice, loading }) => {
    const displayToken = network === "ethereum" ? "ETH" : "SepoliaETH";
    const dollarEquivalent = (balance * ethPrice).toFixed(2);
  
    if (loading) {
      return (
        <div className="space-y-3 mb-6">
          <h1 className="text-white text-xl">Available Balance</h1>
          <p className="text-primary-400">Loading...</p>
        </div>
      );
    }
  
    return (
      <div className="space-y-3 mb-6">
        <h1 className="text-white text-xl">Available Balance</h1>
        <p className="text-primary-400">{balance.toFixed(4)} {displayToken}</p>
        <p className="text-primary-400">${dollarEquivalent}</p>
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
  