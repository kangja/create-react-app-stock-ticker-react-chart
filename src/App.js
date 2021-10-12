import { keyword } from "chalk";
import { useEffect, useState, useMemo } from "react";
import Chart from "react-apexcharts";

const proxyUrl = "https://secret-ocean-49799.herokuapp.com/";
const stocksUrl = `${proxyUrl}https://query1.finance.yahoo.com/v8/finance/chart/GME`;
async function getStocks() {
  const response = await fetch(stocksUrl);

  return response.json();
}

const directionEmojis = {
  up: "🚀 ",
  down: "😢 ",
  "": "",
};

const chart = {
  options: {
    chart: {
      id: "apexchart-example",
    },
  },

  series: [
    {
      data: [
        [1538856000000, 6593.34, 6600, 6582.63, 6600],
        [1538856900000, 6595.16, 6604.76, 6590.73, 6593.86],
      ],
    },
  ],
};

function App() {
  const [price, setPrice] = useState(-1);
  const [prevPrice, setPrevPrice] = useState(-1);
  const [priceTime, setPriceTime] = useState(null);

  useEffect(() => {
    let timeoutId;
    async function getLatestPrice() {
      try {
        const data = await getStocks();
        console.log(data);
        const gme = data.chart.result[0];
        setPrevPrice(price);
        setPrice(gme.meta.regularMarketPrice.toFixed(2));
        setPriceTime(new Date(gme.meta.regularMarketTime * 1000));
        timeoutId = setTimeout(getLatestPrice, 5000);
      } catch (error) {
        console.log(error);
      }
    }

    // timeoutId = setTimeout(getLatestPrice, 5000);
    getLatestPrice();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const direction = useMemo(
    () => (prevPrice < price ? "up" : prevPrice > price ? "down" : ""),
    [prevPrice, price]
  );

  return (
    <div>
      <div className="ticker">GME</div>
      <div className={["price", direction].join(" ")}>
        ${price} {directionEmojis[direction]}
      </div>
      <div className="price-time">
        {priceTime && priceTime.toLocaleTimeString()}
      </div>
      <Chart
        options={chart.options}
        series={chart.series}
        type="candlestick"
        width={500}
        height={320}
      />
    </div>
  );
}

export default App;
