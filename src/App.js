import { useEffect, useState } from "react";

const proxyUrl = "https://secret-ocean-49799.herokuapp.com/";
const stocksUrl = `${proxyUrl}https://query1.finance.yahoo.com/v8/finance/chart/GME`;

async function getStocks() {
  const response = await fetch(stocksUrl);

  return response.json();
}

function App() {
  const [price, setPrice] = useState(-1);
  const [priceTime, setPriceTime] = useState(null);

  useEffect(() => {
    let timeoutId;
    async function getLatestPrice() {
      const data = await getStocks();
      const gme = data.chart.result[0];
      setPrice("$" + gme.meta.regularMarketPrice.toFixed(2));
      setPriceTime(new Date(gme.meta.regularMarketTime * 1000));
      timeoutId = setTimeout(getLatestPrice, 5000);
    }

    timeoutId = setTimeout(getLatestPrice, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div>
      <div className="price">{price}</div>
      <div className="price-time">
        {priceTime && priceTime.toLocaleTimeString()}
      </div>
    </div>
  );
}

export default App;
