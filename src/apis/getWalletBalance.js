// Wallet tracker
import { CovalentClient } from "@covalenthq/client-sdk";
import 'dotenv/config'

const CHAINS = [
  "eth-mainnet",
  "matic-mainnet",
  "bsc-mainnet",
  "arbitrum-mainnet",
  "polygon-zkevm-mainnet",
];
const QUOTE_CURRENCY = ["USD"];

const COVALENT_API_KEY= process.env.COVALENT_API_KEY;

export const getWalletBalance = async (address, chainIndexFound) => {
  try {
    console.time("⌚covalent-api-time");

    const client = new CovalentClient(COVALENT_API_KEY);


    if (chainIndexFound != -1) { // Single Chain
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
    } else { // For 5 chains
      const results = [];

      for (let i = 0; i < CHAINS.length; i++) {
        const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
          CHAINS[i].toString(),
          address, // 0x8bbc2Cc76DC3f6D1CC5E9FE855D66AdB6828B9fe
          { quoteCurrency: QUOTE_CURRENCY[0].toString() }
        );

        if (resp.error) {
          return { error: true, message: resp.error_message };
        }

        results.push(...resp.data.items)
      }
      // console.log("Wallet Data: ", resp.data.items);
  
      console.timeEnd("⌚covalent-api-time");
  
      return { error: false, data: results };
    }
  } catch (error) {
    console.log("Error getting balance of the wallet: ", error);
  }
};

// console.log(await getWalletBalance("0xcbF1e60CBD32bF6C715E2BaF9671BF382f35bdd6"));
// eip155:0xcbF1e60CBD32bF6C715E2BaF9671BF382f35bdd6
