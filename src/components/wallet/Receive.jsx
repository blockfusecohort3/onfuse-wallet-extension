import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { IoShareOutline } from "react-icons/io5";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { useWallet } from "../../contexts/WalletContext";

const Receive = () => {
  const { currentAccount } = useWallet();
  const [isCopied, setIsCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [qrCodeURL, setQrCodeURL] = useState("");

  useEffect(() => {
    if (currentAccount?.publicAddress) {
      QRCode.toDataURL(currentAccount.publicAddress, (err, url) => {
        if (err) {
          console.error('QR code generation failed');
          return;
        }
        setQrCodeURL(url);
      });
    }
  }, [currentAccount]);

  const handleCopy = () => {
    if (!currentAccount?.publicAddress) return;
    
    navigator.clipboard
      .writeText(currentAccount.publicAddress)
      .then(() => {
        setIsCopied(true);
        toast.success("Address copied successfully");
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch(() => {
        toast.error("Unable to copy address");
      });
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-5)}`;
  };

  const toggleShareModal = () => {
    setIsShareModalOpen(!isShareModalOpen);
  };

  if (!currentAccount) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-primary-400">No account connected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center mt-5 space-y-10 bg-white min-h-screen">
      <div className="text-center space-y-5">
        <h1 className="text-gray-800 text-xl font-semibold">Receive</h1>

        <div className="space-y-5">
          {qrCodeURL && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <img src={qrCodeURL} alt="QR Code" className="mx-auto" />
            </div>
          )}
          <p className="text-gray-600">Scan address to receive payment</p>
        </div>

        <div className="relative flex items-center">
          <input
            type="text"
            value={truncateAddress(currentAccount.publicAddress)}
            readOnly
            className="border-2 border-gray-300 bg-white rounded-full text-gray-800 text-sm py-2 w-60 pl-4 pr-24 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            className={`absolute right-12 border-2 text-sm px-2 rounded-full transition-colors ${
              isCopied
                ? "text-green-600 border-green-600 bg-green-50"
                : "text-primary-500 border-primary-500 hover:bg-primary-50"
            }`}
            onClick={handleCopy}
          >
            {isCopied ? "Copied" : "Copy"}
          </button>
          <IoShareOutline
            className="absolute right-3 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
            onClick={toggleShareModal}
          />
        </div>

        {isShareModalOpen && (
          <div className="absolute top-[60%] right-0 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-full">
            <h4 className="text-gray-800 font-semibold mb-3">Share via:</h4>
            <div className="flex justify-center space-x-8">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  currentAccount.publicAddress
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-green-50 transition-colors"
              >
                <FaWhatsapp className="text-green-500 text-2xl" />
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  currentAccount.publicAddress
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-blue-50 transition-colors"
              >
                <FaTelegramPlane className="text-blue-500 text-2xl" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Receive;
