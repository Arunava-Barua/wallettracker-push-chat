import { getWalletBalance } from "../apis/getWalletBalance.js";
import { ethers } from "ethers";

export const formattedWalletBalance = async (address, chainIndexFound) => {
  try {
    console.time("⌚format-wallet-balance-time");

    const data = await getWalletBalance(address, chainIndexFound);
    let totalWorth= 0, tokensArray = [], tokenInfo;

    // console.log("Wallet Data for formatted wallet balance: ", data);

    if (data.error) {
      return { error: true, message: data.message }
    }

    data?.data?.map((item) => {
      let tokenBalance = Number(
        ethers.formatUnits(item.balance, item.contract_decimals)
      ).toFixed(4);

      if (item.quote) {
        totalWorth += item.quote;

        tokenInfo = {
          name: item.contract_ticker_symbol,
          balance: tokenBalance,
          worth: item.quote.toFixed(4)
        }

        tokensArray.push(tokenInfo);
      }
    });

    // console.log("Tokens Array: ", tokensArray)
    
    let top5 = tokensArray.sort((a, b) => Number(b.worth) - Number(a.worth)).slice(0, 5);

    console.timeEnd("⌚format-wallet-balance-time")

    return { error: false, tokensInfo: top5, totalWorth: totalWorth.toFixed(4)}

  } catch (error) {
    console.log("Error while formatting wallet balance: ", error);
  }
};

// const data = await formattedWalletBalance("0xcB034160f7B45E41E6015ECEA09F31A66C144422")
// console.log("Expected data: ", data)
