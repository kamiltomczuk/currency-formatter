import { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [selectedCurrencyName, setSelectedCurrencyName] = useState("");
  const [currencyRates, setCurrencyRates] = useState<Map<string, number>>(
    new Map()
  );
  const [isEuroToPln, setIsEuroToPln] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get<CurrencyResponse>(
          "https://api.nbp.pl/api/exchangerates/tables/A/?format=json"
        );
        const ratesMap = new Map<string, number>();
        response.data[0].rates.forEach((rate: CurrencyRate) => {
          ratesMap.set(rate.code, rate.mid);
        });
        setCurrencies(
          response.data[0].rates.map((rate: CurrencyRate) => rate.code)
        );
        setCurrencyRates(ratesMap);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const selectedRate = currencyRates.get(selectedCurrency);
    if (selectedRate) {
      const calculatedAmount = parseFloat(inputAmount) * selectedRate;
      setAmount(inputAmount);
      if (isEuroToPln) {
        setConvertedAmount(calculatedAmount.toFixed(2));
      } else {
        const convertedAmount = parseFloat(inputAmount) / selectedRate;
        setConvertedAmount(convertedAmount.toFixed(2));
      }
    }
  }, [selectedCurrency, inputAmount, currencyRates, isEuroToPln]);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setInputAmount(value);
    }
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
    setSelectedCurrencyName(e.target.options[e.target.selectedIndex].text);
  };

  const handleToggleCurrency = () => {
    setIsEuroToPln(!isEuroToPln);
    setInputAmount("");
    setConvertedAmount("");
  };

  return (
    <div className="w-full h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate flex flex-col justify-center items-center">
      <h1 className="text-4xl my-3 font-bold">Currency Converter</h1>
      <form className="flex flex-col items-center">
        <input
          type="text"
          value={inputAmount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          required
          className="border-2 border-white rounded-md px-4 py-2 text-xl my-3 font-semibold text-center"
          style={{ justifyContent: "center" }}
        />
        <div className="flex items-center">
          <label htmlFor="euroToPln" className="mr-2">
            <input
              type="radio"
              id="euroToPln"
              checked={isEuroToPln}
              onChange={handleToggleCurrency}
            />
            {isEuroToPln ? "Selected value to PLN" : "PLN to Selected value"}
          </label>
          <label htmlFor="plnToEuro" className="ml-2">
            <input
              type="radio"
              id="plnToEuro"
              checked={!isEuroToPln}
              onChange={handleToggleCurrency}
            />
            {isEuroToPln ? "Selected value to PLN" : "PLN to Selected value"}
          </label>
        </div>
        <select
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          className="border-2 border-white rounded-md px-4 py-2 text-xl my-3 font-semibold text-center"
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="border-2 border-black rounded-md px-4 py-2 my-3 text-xl font-semibold hover:bg-black hover:text-white transition-colors duration-300"
        >
          Convert
        </button>
      </form>
      {convertedAmount && (
        <p className="text-xl my-3 font-semibold">{`${amount} ${
          isEuroToPln ? "PLN" : selectedCurrencyName
        } = ${convertedAmount} ${
          isEuroToPln ? selectedCurrencyName : "PLN"
        }`}</p>
      )}
    </div>
  );
};

export default IndexPage;
