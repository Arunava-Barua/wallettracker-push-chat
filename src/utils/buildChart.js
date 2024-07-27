import ChartJSImage from "chart.js-image";
import { getColours } from "./colours.js";

// Labels - Token Symbols
// BG Colour - Array of colours rgb(255, 99, 132)
// Data - Array of token holding percentage
// Ideal Array length - 35

const DEMO_DATA = {
  error: false,
  tokensInfo: [
    { name: "LINK", balance: "84.6000", worth: "3000" },
    { name: "CQT", balance: "1204.9135", worth: "290" },
    { name: "PUSH", balance: "768.9306", worth: "28" },
    { name: "GTC", balance: "117.1280", worth: "27" },
    { name: "USDC", balance: "40.0000", worth: "26" },
    { name: "GRT", balance: "145.1735", worth: "25" },
    { name: "OGN", balance: "131.4315", worth: "24" },
    { name: "MANA", balance: "22.9711", worth: "23" },
    { name: "ETH", balance: "0.0021", worth: "21" },
    { name: "LINK", balance: "84.6000", worth: "20" },
    { name: "CQT", balance: "1204.9135", worth: "19" },
    { name: "PUSH", balance: "768.9306", worth: "18" },
    { name: "GTC", balance: "117.1280", worth: "17" },
    { name: "USDC", balance: "40.0000", worth: "16" },
    { name: "GRT", balance: "145.1735", worth: "15" },
    { name: "OGN", balance: "131.4315", worth: "14" },
    { name: "MANA", balance: "22.9711", worth: "13" },
    { name: "ETH", balance: "0.0021", worth: "11" },
    { name: "LINK", balance: "84.6000", worth: "22" },
    { name: "CQT", balance: "1204.9135", worth: "12" },
    { name: "PUSH", balance: "768.9306", worth: "10" },
    { name: "GTC", balance: "117.1280", worth: "9" },
    { name: "USDC", balance: "40.0000", worth: "8" },
    { name: "GRT", balance: "145.1735", worth: "7" },
    { name: "OGN", balance: "131.4315", worth: "6" },
    { name: "MANA", balance: "22.9711", worth: "5" },
    { name: "ETH", balance: "0.0021", worth: "4" },
    { name: "LINK", balance: "84.6000", worth: "3" },
    { name: "CQT", balance: "1204.9135", worth: "2" },
    { name: "PUSH", balance: "768.9306", worth: "1" },
  ],
  totalWorth: "3696",
  totalTokens: "2530.1502",
};

export const buildChart = async (tokensData) => {
  try {
    const totalTokenHoldingValuation = Number(tokensData.totalWorth);
    const tokenNames = [],
      valuationPercentage = [];

    // Sort the array in descending order
    tokensData.tokensInfo.sort((a, b) => Number(b.worth) - Number(a.worth));

    // Get the top 3 elements
    let top35Tokens = tokensData.tokensInfo.slice(0, 35);

    top35Tokens.map((token) => {
      tokenNames.push(token.name);

      const tokenValuationPercent = (
        (Number(token.worth) / totalTokenHoldingValuation) *
        100
      ).toFixed(2);

      valuationPercentage.push(tokenValuationPercent);
    });

    const COLOURS = getColours(valuationPercentage.length > 35 ? 35 : valuationPercentage.length);

    const data = {
      labels: tokenNames,
      datasets: [
        {
          label: "Portfolio",
          data: valuationPercentage,
          backgroundColor: COLOURS,
          hoverOffset: 4,
          borderWidth: 0.5,
        },
      ],
    };

    const config = {
      type: "pie",
      data: data,
    };

    const line_chart = ChartJSImage().chart(config);
    const chartBase64 = await line_chart.toDataURI();

    // console.log("Chart URI: ", await line_chart.toDataURI());
    // console.log("Chart URL: ", line_chart.toURL());

    return chartBase64;
  } catch (error) {
    console.log("Errors in charts: ", error);
    return { error: true, message: "Error while building chart!" };
  }
};

// await buildChart(DEMO_DATA);
