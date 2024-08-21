import { formattedTokenApprovals } from "../controller/formattedTokenApprovals.js";

/* 
    /approval ox123...abc pol 
*/
export const command_approvals = async (
  params,
  receiver,
  userAlice,
  resolvedAddress,
  chainIndexFound
) => {
  try {
    let walletData, walletApprovals = "", totalArrovals;

    if (params.length == 2) {
      // All chains
      chainIndexFound = -1;

      walletData = await formattedTokenApprovals(
        resolvedAddress,
        chainIndexFound
      );

      if (walletData.error) {
        throw {
          message: `${walletData.message}`,
        };
      }

      const data = walletData.tokensInfo;
      totalArrovals = walletData.totalApprovals;

      let formattedString = "";

      for (const [key, value] of Object.entries(data)) {
        if (value.length > 0) {
          // Check if the value is not empty
          formattedString += `• ${key}\n${value}\n`; // Append the chain and its balances
        }
      }

      walletApprovals += formattedString.trim();
    }

    if (params.length == 3) {
      walletData = await formattedTokenApprovals(
        resolvedAddress,
        chainIndexFound
      );

      if (walletData.error) {
        throw {
          message: `${walletData.message}`,
        };
      }

      const data = walletData.tokensInfo;
      totalArrovals = walletData.totalApprovals;

      walletApprovals += data;
    }

    // ***************************************************************
    // //////////////////// SENDING MESSAGES /////////////////////////
    // ***************************************************************

    await userAlice.chat.send(receiver, {
      type: "Text",
      content: `Total Active Approvals: ✅ ${totalArrovals}\n\n${walletApprovals}`,
    });
    // console.log("Message sent: ", walletApprovals)
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

// const response = await command_approvals([1,2,3],"","", "0xcB034160f7B45E41E6015ECEA09F31A66C144422", 0)