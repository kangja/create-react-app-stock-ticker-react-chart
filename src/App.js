import { useEffect, useState } from "react";

const proxyUrl = "https://secret-ocean-49799.herokuapp.com/";
const stocksUrl = `${proxyUrl}https://query1.finance.yahoo.com/v8/finance/chart/GME`;

async function getStocks() {
  const response = await fetch(stocksUrl);

  return response.json();
}

function App() {
  const [price, setPrice] = useState(-1);

  useEffect(() => {
    getStocks().then((data) => {
      const gme = data.chart.result[0];
      console.log(gme);
      setPrice(gme.meta.regularMarketPrice);
    });
  }, []);

  return <div className="price">{price}</div>;
}

export default App;
