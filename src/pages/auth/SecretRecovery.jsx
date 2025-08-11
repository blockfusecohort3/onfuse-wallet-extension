import { useState } from "react";
import { GoCopy } from "react-icons/go";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ActiveHeader from "../../components/layout/ActiveHeader";

const SecretRecovery = () => {
  const [showPhrase, setShowPhrase] = useState(false);
  const [copySuccess, setCopySuccess] = useState(""); 
  const navigate = useNavigate();
  const location = useLocation();
 
  const mnemonic = location.state?.mnemonic;
  

  if (!mnemonic) {
    navigate("/");
    return null;
  }

  const seedPhrases = mnemonic.split(" ");

  const handleCopy = () => {
    navigator.clipboard
      .writeText(mnemonic)
      .then(() => {
        setCopySuccess("Copied!");
        toast.success("Recovery phrase copied to clipboard");
        setTimeout(() => setCopySuccess(""), 4000);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const handleSecretGuess = () => {
    navigate("/recovery-guess", {
      state: { mnemonic: mnemonic }
    });
  };

  return (
    <div className="h-full flex flex-col items-center p-6 overflow-auto bg-gray-950">
      <ActiveHeader/>
      <h3 className="text-white text-center text-xl mt-14">
        Write down your Secret Recovery Phrase
      </h3>
      <h2 className="text-white text-center mt-4">
        Tips to safeguarding your secret recovery phrases:
      </h2>
      <ul className="list-disc pl-4 text-white mt-4">
        <li>Save in a password manager</li>
        <li>Store in a safe deposit box</li>
        <li>Write down and store in multiple secret places</li>
      </ul>
      <div className="h-auto mx-auto mt-6 text-center w-full max-w-[400px] bg-gray-900 rounded-[10px] p-4 overflow-hidden">
        <div className="flex mt-[-3px] flex-wrap justify-between align-center gap-2">
          {seedPhrases.map((phrase, index) => (
            <span
              key={index}
              className={`rounded-lg w-[30%] text-center text-white bg-black py-2 ${
                showPhrase ? "bg-opacity-50" : "bg-opacity-10"
              }`}
            >
              {showPhrase ? phrase : "****"}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center w-full max-w-[400px] mt-4 mb-2">
        <div className="text-black-300 text-sm flex items-center space-x-2">

          {showPhrase ? (
            <IoEyeOutline
              onClick={() => setShowPhrase(false)}
              className="cursor-pointer text-gray-300 text-xl"
            />
          ) : (
            <IoEyeOffOutline
              onClick={() => setShowPhrase(true)}
              className="cursor-pointer text-gray-300 text-xl"
            />
          )}
          <span className="text-gray-300 text-sm flex items-center space-x-1 cursor-pointer">Show seed phrase</span>
        </div>
        <div
          className="text-purple-400 text-sm flex items-center space-x-1 cursor-pointer"
          onClick={handleCopy}
        >
          {copySuccess ? (
            <span className="text-green-500">{copySuccess}</span>
          ) : (
            <>
              <GoCopy className="text-xl" />
              <span>Copy to clipboard</span>
            </>
          )}
        </div>
      </div>
      <button
        className="mt-2 text-white rounded-full py-2 w-[250px] bg-gradient-to-r from-primary-500 to-primary-800"

        onClick={handleSecretGuess}
      >
        Next
      </button>
    </div>
  );
};

export default SecretRecovery;
