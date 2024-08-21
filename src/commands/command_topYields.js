import { formattedYields } from "../controller/formattedYields.js";
import { getDomainName } from "../utils/getDomainName.js";

// /topyields [address] [chain]
export const command_topYields = async (
  params,
  receiver,
  userAlice,
  resolvedAddress,
  chainIndexFound
) => {
  try {
    let topYieldsMessage =
      "🚀 These are the Top APRs for your portfolio across platforms 🚀\n";

    const response = await formattedYields(resolvedAddress, chainIndexFound);

    if (response.error) {
      throw {
        message: `${response.message}`,
      };
    }

    const { yields, totalYields } = response;

    Object.keys(yields).forEach((key, i) => {
      const apr = yields[key].apr;
      const platform = yields[key].platform;
      const link = yields[key].link;
      const category = yields[key].category;
      const pair = yields[key].pair;

      topYieldsMessage += `• ${(apr).toFixed(2)}% APR by ${ category == "Liquidity Pool" ?  `providing liquidity at ${key}/${pair} pool on ${platform}. ( ${link.substring(8)} )` : `depositing ${key} on ${platform}. ( ${link.substring(8)} )`}\n`;
    });

    // console.log(topYieldsMessage);

    // ***************************************************************
    // //////////////////// SENDING MESSAGES /////////////////////////
    // ***************************************************************

    await userAlice.chat.send(receiver, {
      type: "Text",
      content: `${topYieldsMessage}`,
    });

  } catch (error) {
    console.log(error);
    await userAlice.chat.send(receiver, {
      type: "Text",
      content: `${
        error.message
          ? error.message
          : "Something went wrong. Try again after some time!"
      }`,
    });
  }
};

// command_topYields("", "", "", "0xcB034160f7B45E41E6015ECEA09F31A66C144422", -1)