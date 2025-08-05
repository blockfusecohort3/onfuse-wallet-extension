// src/pages/auth/RecoveryGuess.jsx - REFACTORED
import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { replaceRandomMnemonics, validateMnemonics } from "../../utils/helpers";
import { toast } from "react-toastify";
import { WALLET_CONSTANTS } from "../../constants";

const RecoveryGuess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState, setValue } = useForm();
  const { errors } = formState;

  const mnemonic = location.state?.mnemonic;

  const seedPhrases = useMemo(() => mnemonic?.split(" ") || [], [mnemonic]);
  
  const newSeedPhrase = useMemo(() => (mnemonic ? replaceRandomMnemonics(seedPhrases) : []), [mnemonic, seedPhrases]);

  useEffect(() => {
    if (mnemonic) {
      newSeedPhrase.forEach((phrase, index) => {
        setValue((index + 1).toString(), phrase);
      });
    }
  }, [mnemonic, newSeedPhrase, setValue]);

  if (!mnemonic) {
    navigate("/");
    return null;
  }

  const onSubmit = (data) => {
    const guessedPhrase = Object.values(data);
    const isValid = validateMnemonics(seedPhrases, guessedPhrase);

    if (isValid) {
      toast.success("Phrase confirmed successfully");
      navigate("/send-receive");
    } else {
      toast.error("Invalid phrase. Please try again.");
    }
  };

  return (
    <div className="mt-3">
      <h2 className="mt-20 text-center text-primary-400 text-xl font-semibold">
        Confirm Secret Recovery Phrase
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="h-[236px] mx-auto text-center w-[319px] rounded-[10px] bg-primary-100">
          <div className="grid grid-cols-3 gap-4 px-4 pt-10">
            {[...Array(WALLET_CONSTANTS.SEED_PHRASE_COUNT)].map((_, index) => {
              const fieldName = (index + 1).toString();
              return (
                <input
                  key={fieldName}
                  type="text"
                  className={`rounded-lg w-20 text-center ${
                    errors[fieldName] ? "border border-red-700" : "border-none"
                  }`}
                  placeholder=""
                  {...register(fieldName, {
                    validate: (value) => !!value || "Required",
                  })}
                />
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 ml-11 text-white text-lg rounded-3xl px-2 py-1 w-[251px] bg-gradient-to-r from-primary-50 to-primary-100 hover:bg-opacity-75"
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

export default RecoveryGuess;
