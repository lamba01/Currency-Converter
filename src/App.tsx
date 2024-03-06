import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CgArrowsExchangeV } from "react-icons/cg";
import "./App.css"

interface Currency {
  code: string;
  rate: number;
}

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch currency list from an API (for example, Open Exchange Rates)
    axios.get('https://open.er-api.com/v6/latest')
      .then(response => {
        const currencyList: Currency[] = Object.keys(response.data.rates).map((code: string) => ({
          code,
          rate: response.data.rates[code],
        }));
        setCurrencies(currencyList);
      })
      .catch(error => {
        console.error('Error fetching currencies:', error);
      });
  }, []);

  const handleConvert = () => {
    // Perform currency conversion
    if (fromCurrency !== toCurrency) {
      const fromRate = currencies.find(currency => currency.code === fromCurrency)?.rate || 1;
      const toRate = currencies.find(currency => currency.code === toCurrency)?.rate || 1;
      const result = (amount / fromRate) * toRate;
      setConvertedAmount(result);
    } else {
      // If same currencies selected, set result to the entered amount
      setConvertedAmount(amount);
    }
  };

  return (
    <div>
      <div className="converter">
      <h1>Currency Converter</h1>
      <p>Check live rates, set rates alert, receive notifications and more</p>
      <div className="form">
      <div>
      <p className='form-label'>amount</p>
        <label>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>{currency.code}</option>
            ))}
          </select>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </label>
      </div>
      
      <div className="separator">
      <div className="line"></div>
      <button onClick={handleConvert}><CgArrowsExchangeV size={'2em'}/></button>
      <div className="line"></div>
      </div>
      <div>
      <p className='form-label'>converted amount</p>
      <div className='converted-div'>
        <label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>{currency.code}</option>
            ))}
          </select>
        </label>
        {convertedAmount !== null && (
        <div className='converted-digit-container'>
          <p>{convertedAmount.toFixed(2)}</p>
        </div>
      )}
      </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;



