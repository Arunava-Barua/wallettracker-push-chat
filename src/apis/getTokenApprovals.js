// ***************************************************************
// /////////////////// Get Token Approvals ///////////////////////
// ***************************************************************
//  Get data from Covalent API regarding token approvals across platforms

import { CovalentClient } from "@covalenthq/client-sdk";
import "dotenv/config";

const CHAINS = [
  "eth-mainnet",
  "matic-mainnet",
  "bsc-mainnet",
  "arbitrum-mainnet",
  "polygon-zkevm-mainnet",
];
const QUOTE_CURRENCY = ["USD"];

const FORMATTED_CHAINS = [
  "Ethereum",
  "Polygon",
  "Binance",
  "Arbitrum",
  "Polygon zkEVM",
];

// const COVALENT_API_KEY = process.env.COVALENT_API_KEY;
const COVALENT_API_KEY = "ckey_91f0e2d313784ddc842e33e0bac";

export const getTokenApprovals = async (address, chainIndexFound) => {
  try {
    const client = new CovalentClient(COVALENT_API_KEY);

    if (chainIndexFound != -1) {
      // Single Chain
      const resp = await client.SecurityService.getApprovals(
        CHAINS[chainIndexFound].toString(),
        address
      );

      if (resp.error) {
        return { error: true, message: resp.error_message };
      }

      return { error: false, data: resp.data.items };
    } else {
      // For 5 chains
      const resultsObj = {};

      for (let i = 0; i < CHAINS.length; i++) {
        const resp = await client.SecurityService.getApprovals(
          CHAINS[i].toString(),
          address
        );

        if (resp.error) {
          return { error: true, message: resp.error_message };
        }

        // Get a key for the object
        const key = FORMATTED_CHAINS[i].toString();

        // Assign the array values to the object key
        resultsObj[key] = [...resp.data.items];
      }

      return { error: false, data: resultsObj };
    }
  } catch (error) {
    console.log(error)
    return {
      error: true,
      message: "Error getting token approvals of the wallet!",
    };
  }
};

// const res = await getTokenApprovals("0x8bbc2Cc76DC3f6D1CC5E9FE855D66AdB6828B9fe", 1)
// console.log(res);
