import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface CurrencyRate {
  currency: string;
  code: string;
  mid: number;
}

interface CurrencyResponse {
  rates: CurrencyRate[];
}

const IndexPage = () => {
  const [amount, setAmount] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get<CurrencyResponse>(
        "https://api.nbp.pl/api/exchangerates/rates/a/eur/?format=json"
      );

      const { mid } = response.data.rates[0];
      const calculatedAmount = parseFloat(inputAmount) * mid;
      setAmount(inputAmount);
      setConvertedAmount(calculatedAmount.toFixed(2));
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputAmount(e.target.value);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate flex flex-col justify-center items-center">
      <h1 className="text-4xl my-3 font-bold">Przeliczanie EUR na PLN</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={inputAmount}
          onChange={handleAmountChange}
          placeholder="Podaj kwotę w EUR"
          required
          className="border-2 border-white rounded-md px-4 py-2 text-xl my-3 font-semibold text-center"
          style={{ justifyContent: "center" }}
        />
        <button
          type="submit"
          disabled={loading}
          className="border-2 border-black rounded-md px-4 py-2 my-3 text-xl font-semibold hover:bg-black hover:text-white transition-colors duration-300"
        >
          Przelicz
        </button>
      </form>
      {convertedAmount && (
        <p className="text-xl my-3 font-semibold">{`${amount} EUR = ${convertedAmount} PLN`}</p>
      )}
    </div>
  );
};

export default IndexPage;
