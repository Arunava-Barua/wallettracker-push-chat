import { getWalletBalance } from "../apis/getWalletBalance.js";
import { ethers } from "ethers";

export const formattedWalletBalance = async (address, chainIndexFound) => {
  try {
    console.time("⌚format-wallet-balance-time");

    const data = await getWalletBalance(address, chainIndexFound);
    
    let totalWorth = 0,
      totalTokenCount = 0,
      tokensArray = [],
      tokenInfo;

    // console.log("Wallet Data for formatted wallet balance: ", data);

    if (data.error) {
      return { error: true, message: data.message };
    }

    if (chainIndexFound == -1) {
      let chainWiseTokens = data?.data;
      let values = [];

      const keys = Object.keys(chainWiseTokens);

      keys.forEach((key) => {
        console.log(key);
        const tokenValues = chainWiseTokens[key];

        tokenValues.map((token) => {
          let tokenBalance = Number(
            ethers.formatUnits(token.balance, token.contract_decimals)
          ).toFixed(4);

          if (token.quote) {
            totalWorth += token.quote;
            totalTokenCount += Number(
              ethers.formatUnits(token.balance, token.contract_decimals)
            );

            tokenInfo = {
              name: token.contract_ticker_symbol,
              balance: tokenBalance,
              worth: token.quote.toFixed(4),
            };

            values.push(tokenInfo);
          }
        });

        let filterTokens = values.filter((token) => token.worth > 1);
        chainWiseTokens[key] = filterTokens;
        values = [];
      });

      console.timeEnd("⌚format-wallet-balance-time");

      return {
        error: false,
        tokensInfo: chainWiseTokens,
        totalWorth: totalWorth.toFixed(4),
        totalTokens: totalTokenCount.toFixed(4),
      };
    }

    data?.data?.map((item) => {
      let tokenBalance = Number(
        ethers.formatUnits(item.balance, item.contract_decimals)
      ).toFixed(4);

      if (item.quote) {
        totalWorth += item.quote;
        totalTokenCount += Number(
          ethers.formatUnits(item.balance, item.contract_decimals)
        );

        tokenInfo = {
          name: item.contract_ticker_symbol,
          balance: tokenBalance,
          worth: item.quote.toFixed(4),
        };

        tokensArray.push(tokenInfo);
      }
    });

    // console.log("Tokens Array: ", tokensArray)

    // let top5 = tokensArray.sort((a, b) => Number(b.worth) - Number(a.worth)).slice(0, 5);
    let filterTokens = tokensArray.filter((token) => token.worth > 1);

    // console.log("Filtered tokens: ", filterTokens)

    console.timeEnd("⌚format-wallet-balance-time");

    return {
      error: false,
      tokensInfo: filterTokens,
      totalWorth: totalWorth.toFixed(4),
      totalTokens: totalTokenCount.toFixed(4),
    };
  } catch (error) {
    console.log("Error while formatting wallet balance: ", error);
    return {
      error: true,
      message:
        "Something went wrong while formatting your wallet balance! Try again or contact owner!",
    };
  }
};

// const data = await formattedWalletBalance("0xcB034160f7B45E41E6015ECEA09F31A66C144422", 0)
// console.log("Expected data: ", data)
