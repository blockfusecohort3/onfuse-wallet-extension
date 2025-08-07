import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { helperMethods } from "../../utils/helpers";
import { toast } from "react-toastify";
import { WALLET_CONSTANTS } from "../../constants";
import { motion } from "framer-motion";

const RecoveryGuess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState, setValue } = useForm();
  const { errors } = formState;

  const mnemonic = location.state?.mnemonic;
  console.log(mnemonic)

  const seedPhrases = useMemo(() => mnemonic?.split(" ") || [], [mnemonic]);
  console.log(seedPhrases)

  // const newSeedPhrase = useMemo(() => {
  //   if (!mnemonic) return [];
  //   const result = helperMethods.replaceRandomMnemonics(seedPhrases);
  //   console.log("result:",result)
  //   return Array.isArray(result) ? result : [];
  // }, [mnemonic, seedPhrases]);

  const [newSeedPhrase, setNewSeedPhrase] = useState([]);

useEffect(() => {
  const fetchNewSeedPhrase = async () => {
    if (!mnemonic) return;

    try {
      const result = await helperMethods.replaceRandomMnemonics(seedPhrases);
      if (Array.isArray(result)) {
        setNewSeedPhrase(result);
      } else {
        console.error("Unexpected result from replaceRandomMnemonics:", result);
      }
    } catch (error) {
      console.error("Error replacing random mnemonics:", error);
    }
  };

  fetchNewSeedPhrase();
}, [mnemonic, seedPhrases]);



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

  const onSubmit = async (data) => {
    const guessedPhrase = Object.values(data);
    console.log("guessedPhrase", guessedPhrase)
    console.log("seedP", seedPhrases)
    const isValid = await helperMethods.validateMnemonics(seedPhrases, guessedPhrase);
    console.log("isValid", isValid)


    if (isValid) {
      toast.success("Phrase confirmed successfully");
      navigate("/send-receive");
    } else {
      toast.error("Invalid phrase. Please try again.");
    }
  };

  return (
   
<div className="min-h-screen bg-gray-950 p-4 flex flex-col items-center justify-start">
  <motion.h2
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="mt-20 text-center text-primary-100 text-xl font-semibold"
  >
    Confirm Secret Recovery Phrase
  </motion.h2>

  <motion.form
    onSubmit={handleSubmit(onSubmit)}
    className="mt-12 w-full max-w-md"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="rounded-xl bg-gray-800 shadow-lg p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="grid grid-cols-3 gap-4 rounded-full">
        {[...Array(WALLET_CONSTANTS.SEED_PHRASE_COUNT)].map((_, index) => {
          const fieldName = (index + 1).toString();
          return (
            <motion.input
              key={fieldName}
              type="text"
              autoComplete="off"
              className={`p-2 text-center text-sm rounded-lg bg-gray-900 text-white border 
                ${errors[fieldName] ? "border-red-600" : "border-gray-600"} 
                focus:outline-none focus:ring-2 focus:ring-primary-400`}
              {...register(fieldName, {
                validate: (value) => !!value || "Required",
              })}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            />
          );
        })}
      </div>
    </motion.div>

    <motion.div
      className="flex justify-center mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <motion.button
        type="submit"
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        className="text-white text-lg rounded-full px-6 py-2 w-full bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 
                   hover:brightness-110 transition-all duration-300 ease-in-out"
      >
        Confirm
      </motion.button>
    </motion.div>
  </motion.form>
</div>
  );
};

export default RecoveryGuess;
