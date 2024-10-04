// Wallet tracker
import { CovalentClient } from "@covalenthq/client-sdk";
import "dotenv/config";

const CHAINS = [
  "eth-mainnet",
  "matic-mainnet",
  "bsc-mainnet",
  // "arbitrum-mainnet",
  // "polygon-zkevm-mainnet",
];
const QUOTE_CURRENCY = ["USD"];

const FORMATTED_CHAINS = [
  "Ethereum",
  "Polygon",
  "Binance",
  "Arbitrum",
  "Polygon zkEVM",
];

// const COVALENT_API_KEY= process.env.COVALENT_API_KEY;
const COVALENT_API_KEY= "ckey_91f0e2d313784ddc842e33e0bac";

export const getWalletBalance = async (address, chainIndexFound) => {
  try {
    console.time("⌚covalent-api-time");

    const client = new CovalentClient(COVALENT_API_KEY);

    if (chainIndexFound != -1) {
      // Single Chain
      const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
        CHAINS[chainIndexFound].toString(),
        address, //  0x8bbc2Cc76DC3f6D1CC5E9FE855D66AdB6828B9fe
        { quoteCurrency: QUOTE_CURRENCY[0].toString() }
      );

      if (resp.error) {
        return { error: true, message: resp.error_message };
      }

      console.timeEnd("⌚covalent-api-time");

      return { error: false, data: resp.data.items };
    } else {
      // For 5 chains
      const results = [];
      const resultsObj = {};

      for (let i = 0; i < CHAINS.length; i++) {
        const resp =
          await client.BalanceService.getTokenBalancesForWalletAddress(
            CHAINS[i].toString(),
            address, // 0x8bbc2Cc76DC3f6D1CC5E9FE855D66AdB6828B9fe
            { quoteCurrency: QUOTE_CURRENCY[0].toString() }
          );

        if (resp.error) {
          return { error: true, message: resp.error_message };
        }

        // Get a key for the object
        const key = FORMATTED_CHAINS[i].toString();

        // Assign the array values to the object key
        resultsObj[key] = [...resp.data.items];

        // results.push(...resp.data.items);
      }

      // console.log("Wallet Data: ", resultsObj);

      console.timeEnd("⌚covalent-api-time");

      return { error: false, data: resultsObj };
    }
  } catch (error) {
    console.log("Error getting balance of the wallet: ", error);
  }
};

// const response = await getWalletBalance("0x8bbc2Cc76DC3f6D1CC5E9FE855D66AdB6828B9fe", -1);
// const obj = response.data;
// const combinedArray = Object.values(obj).flat();
// console.log(combinedArray);
// eip155:0xcbF1e60CBD32bF6C715E2BaF9671BF382f35bdd6
