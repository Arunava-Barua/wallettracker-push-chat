import ChartJSImage from "chart.js-image";

// Labels - Token Symbols
// BG Colour - Array of colours rgb(255, 99, 132)
// Data - Array of token holding percentage

const DEMO_DATA = {
  error: false,
  tokensInfo: [
    { name: "LINK", balance: "84.6000", worth: "1244.5507" },
    { name: "CQT", balance: "1204.9135", worth: "196.4009" },
    { name: "PUSH", balance: "768.9306", worth: "130.7182" },
    { name: "GTC", balance: "117.1280", worth: "119.0020" },
    { name: "USDC", balance: "40.0000", worth: "39.9960" },
    { name: "GRT", balance: "145.1735", worth: "33.6802" },
    { name: "OGN", balance: "131.4315", worth: "14.4575" },
    { name: "MANA", balance: "22.9711", worth: "7.8791" },
    { name: "ETH", balance: "0.0021", worth: "7.6394" },
  ],
  totalWorth: "1794.3253",
  totalTokens: "2530.1502",
};

export const buildChart = async (tokensData) => {
  try {
    const totalTokenHoldingValuation = Number(tokensData.totalWorth);
    const tokenNames = [], valuationPercentage = [];

    tokensData.tokensInfo.map((token) => {
      tokenNames.push(token.name);

      const tokenValuationPercent = (
        (Number(token.worth) / totalTokenHoldingValuation) *
        100
      ).toFixed(2);

      valuationPercentage.push(tokenValuationPercent);
    });

    const data = {
      labels: tokenNames,
      datasets: [
        {
          label: "Portfolio",
          data: valuationPercentage,
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgb(89, 61, 232)",
            "rgb(61, 106, 86)",
            "rgb(61, 232, 86)",
            "rgb(94, 250, 26)",
            "rgb(191, 250, 26)",
            "rgb(250, 123, 26)",
          ],
          hoverOffset: 4,
        },
      ],
    };

    const config = {
      type: "pie",
      data: data,
    };
    
    const line_chart = ChartJSImage().chart(config);
    const chartBase64 = await line_chart.toDataURI()
    
    // console.log("Chart URI: ", await line_chart.toDataURI());
    // console.log("Chart URL: ", line_chart.toURL());

    return chartBase64

  } catch (error) {
    console.log("Errors in charts: ", error);
    return { error: true, message: "Error while building chart!" };
  }
};

// await buildChart(DEMO_DATA);




