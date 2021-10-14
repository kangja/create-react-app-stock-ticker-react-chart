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
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "CandleStick Chart",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  },
};

function App() {
  const [series, setSeries] = useState([
    {
      data: [],
    },
  ]);
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
        const prices = gme.chart.timestamps((timestamp) => ({
          x: new Date(timestamp * 1000),
          y: [],
        }));
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
        type="candlestick"
        series={series}
        width="100%"
        height={320}
      />
    </div>
  );
}

export default App;
