import "./StockPriceTracker.css"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = '8d07735db0c94d4f9533165e90414c5e'; // Replace with your Twelve Data API key
const symbol = 'VMW'; // Replace with the stock symbol you want to track
const alertPrice = 200; // Replace with the stock price that triggers an alert

function StockPriceTracker() {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`);
      const data = await response.json();
      setPrice(data.price);

      if (data.price < alertPrice) {
        sendEmailAlert(data.price);
      }
    };

    const sendEmailAlert = async (price) => {
      try {
        await axios.post('https://api.sendgrid.com/v3/mail/send', {
          personalizations: [{
            to: [{ email: 'your_email@example.com' }],
            subject: `Alert: ${symbol} stock price is below ${alertPrice}`,
          }],
          from: { email: 'noreply@example.com' },
          content: [{
            type: 'text/plain',
            value: `The current price of ${symbol} is ${price}.`,
          }],
          mail_settings: {
            sandbox_mode: { enable: true },
          },
        }, {
          headers: {
            Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Email alert sent!');
      } catch (error) {
        console.error('Failed to send email alert:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Fetch data every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  if (!price) {
    return <p>Loading...</p>;
  }

  return (
    <div className="stock">
      <h2>Current price of {symbol}:</h2>
      <h3>{price && `$${Number(price).toFixed(2)}`}</h3>
      <p>{`As of ${new Date().toLocaleString()}`}</p>
    </div>
  );
}

export default StockPriceTracker;