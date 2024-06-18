import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";

import { formattedWalletBalance } from "./src/controller/formattedWalletBalance.js";

import { checkValidWalletAddress } from "./src/utils/checkValidWalletAddress.js";
import { resolveENS } from "./src/utils/resolveENS.js";
import { resolveUD } from "./src/utils/resolveUD.js";

import { getCryptoEvents } from "./src/apis/getCryptoEvents.js";

import 'dotenv/config'

const provider = new ethers.JsonRpcProvider(`${process.env.ETHEREUM_RPC_PROVIDER}`);
const signer = new ethers.Wallet(
  `${process.env.PRIVATE_KEY}`,
  provider
);
console.log("Signer: ", signer);

const COMMANDS = ["/portfolio", "/help", "/calendar"];
const CHAINS = ["eth", "pol", "bsc", "arb", "polzk"]

const WELCOME_MESSAGE = "Welcome to Wallet Tracker🎊\n";

const HELP_MESSAGE = `To best use this tool, you can use the following command(s)👇\n1. /portfolio [wallet address] [chain] - To get you current token holding and asset valuation on specified chain. Chain options: "eth", "pol", "bsc", "arb", "polzk". If not specified, you'll get the portfolio across all 5 chains\n2. /calendar [number of days] - To get crypto events organized by your favorite tokens within number of days\nWe are constantly working on it and adding new features. Type '/help' to get the latest available commands and responses.`;

const userAlice = await PushAPI.initialize(signer, {
  env: CONSTANTS.ENV.PROD,
});

if (userAlice.errors.length > 0) {
  // Handle Errors Here
}

const stream = await userAlice.initStream(
  [
    CONSTANTS.STREAM.CHAT, // Listen for chat messages
    CONSTANTS.STREAM.NOTIF, // Listen for notifications
    CONSTANTS.STREAM.CONNECT, // Listen for connection events
    CONSTANTS.STREAM.DISCONNECT, // Listen for disconnection events
  ],
  {
    filter: {
      channels: ["*"],
      chats: ["*"],
    },
    // Connection options:
    connection: {
      retries: 3, // Retry connection 3 times if it fails
    },
    raw: false, // Receive events in structured format
  }
);

// Chat event listeners:

// Stream connection established:
stream.on(CONSTANTS.STREAM.CONNECT, async (a) => {
  console.log("Stream Connected");

  // Send initial message to PushAI Bot:
  console.log("Sending message to Wallet Tracker Bot");
});

// Chat message received:
stream.on(CONSTANTS.STREAM.CHAT, async (message) => {
  try {
    console.log("Encrypted Message Received");
    console.log("Message: ", message); // Log the message payload

    if (message.event == "chat.request") {
      const response = await userAlice.chat.accept(message.from);
      console.log("Accept response: ", response);
    }

    // start whole
    console.time("⌚totalExecutionTime"); // Start total timer

    if (message.origin === "self") {
      console.log("Ignoring the message...");
      return;
    }

    if (!message.message.content) {
      throw {
        message:
          "Couldn't read the last message💥.\n Try again after some time!",
      };
    }

    const params = message.message.content.split(" ");
    const command = params[0];

    if (!COMMANDS.includes(command.toLowerCase())) {
      throw {
        message: `${WELCOME_MESSAGE}${HELP_MESSAGE}`,
      };
    }

    // help
    if (command == COMMANDS[1].toString()) {
      if (params.length != 1) {
        throw {
          message: `Invalid parameters count⚠️\nPlease follow the specific format:\nportfolio [your wallet address]`,
        };
      }

      await userAlice.chat.send(message.from, {
        type: "Text",
        content: `${HELP_MESSAGE}`,
      });
    }

    // portfolio
    if (command == COMMANDS[0].toString()) {
      if (params.length != 2 && params.length != 3) {
        throw {
          message: `Invalid parameters count⚠️\nPlease follow the specific format:\n/portfolio [your wallet address] [chain]`,
        };
      }

      let chainIndexFound;

      if (params.length == 3) {
        chainIndexFound = CHAINS.findIndex((chain) => chain == params[2]);

        if (chainIndexFound == -1) {
          throw {
            message: `Invalid chain⚠️\nPlease select one from these supported chains:\n1. Ethereum Mainnet - "eth"\n2. Polygon Mainnet - "pol"\n3. Binance Smart Chain - "bsc"\n4. Arbitrum Mainnet - "arb"\n5. Polygon zkEVM Mainnet - "polzk"`,
          };
        }
      }

      const address = params[1];

      console.log(`📌Command: ${command}, address: ${address}`);

      let resolvedAddress = "";
      resolvedAddress = address;

      if (address.substring(0, 2) !== "0x") {
        resolvedAddress = await resolveENS(address);
        console.log("Resolved Address ENS: ", resolvedAddress)

        if (resolvedAddress.error) {
          resolvedAddress = await resolveUD(address);
          console.log("Resolved Address UD: ", resolvedAddress)

          if (resolvedAddress.error) {
            throw {
              message: `Invalid domain⚠️\nCheck your domain name`,
            };
          }
        }

        console.log("Resolved Address: ", resolvedAddress);
      }

      if (!checkValidWalletAddress(resolvedAddress)) {
        throw {
          message: `Invalid address⚠️\nCheck your wallet address`,
        };
      }

      let walletData;

      if (params.length == 2) {
        // All chains
        chainIndexFound = -1;
        walletData = await formattedWalletBalance(resolvedAddress, chainIndexFound);
      }

      if (params.length == 3) {
        // Specific chain
        walletData = await formattedWalletBalance(resolvedAddress, chainIndexFound);
      }

      if (walletData.error) {
        throw {
          message: `${walletData.message}`,
        };
      }

      const walletWorth = walletData.totalWorth;
      const walletTokens = walletData.tokensInfo;

      let walletPerformance;

      if (chainIndexFound == -1) {
        walletPerformance = `Total Assets Worth: 💲${walletWorth}\n\n\n`;
      }

      if (chainIndexFound != -1) {
        walletPerformance = `Assets Worth: 💲${walletWorth}\n\n\n`;
      }

      walletTokens.map((walletToken, index) => {
        walletPerformance += `• ${walletToken.name}: ${walletToken.balance} ($${walletToken.worth})\n`;
      });

      // console.timeEnd("⌚totalExecutionTime"); // End total timer

      console.time("⌚sending-message-time");

      const aliceMessagesBob = await userAlice.chat.send(message.from, {
        type: "Text",
        content: `${walletPerformance}`,
      });

      console.timeEnd("⌚sending-message-time");

      console.timeEnd("⌚totalExecutionTime"); // End total timer
    }

    // calendar
    if (command == COMMANDS[2].toString()) {
      if (params.length != 2) {
        throw {
          message: `Invalid parameters count⚠️\nPlease follow the specific format:\n/calendar [number of days]`,
        };
      }

      const noOfDays = Number(params[1]);

      console.log(`📌Command: ${command}, end date: ${noOfDays}`);

      if (typeof noOfDays != "number" || noOfDays < 0) {
        throw {
          message:
            "Parameter should be an positive number. Please again again with a positive number.",
        };
      }

      // Error from covalent
      const walletData = await formattedWalletBalance(message.from.slice(7));

      console.log("⚠️⚠️⚠️Wallet DAta: ", walletData);

      if (walletData.error) {
        throw {
          message: `${walletData.message}`,
        };
      }

      if (walletData.tokensInfo.length == 0) {
        throw {
          message:
            "There are no tokens in your wallet. Try a different wallet!!",
        };
      }

      const walletTokens = walletData.tokensInfo;
      let tokenSymbols = [];

      walletTokens.map((walletToken, index) => {
        tokenSymbols.push(walletToken.name);
      });

      // Get events here
      const { cryptoEvents } = await getCryptoEvents(tokenSymbols, noOfDays);

      if (cryptoEvents.length == 0) {
        throw { message: "No crypto events within the specified days!" };
      }

      const eventsMessage =
        "Here, is the list of events organized📅: \n• " +
        cryptoEvents.join("\n• ");

      // console.timeEnd("⌚totalExecutionTime"); // End total timer

      console.time("⌚sending-message-time");

      const aliceMessagesBob = await userAlice.chat.send(message.from, {
        type: "Text",
        content: `${eventsMessage}`,
      });

      console.timeEnd("⌚sending-message-time");

      console.timeEnd("⌚totalExecutionTime"); // End total timer
    }
  } catch (error) {
    console.log("Error from index: ", error);

    await userAlice.chat.send(message.from, {
      type: "Text",
      content: `${
        error.message
          ? error.message
          : "Something went wrong. Try again after some time!"
      }`,
    });
  }
});

// Chat operation received:
stream.on(CONSTANTS.STREAM.CHAT_OPS, (data) => {
  console.log("Chat operation received.");
  console.log(data); // Log the chat operation data
});

// Connect the stream:
await stream.connect(); // Establish the connection after setting up listeners

// Stream disconnection:
stream.on(CONSTANTS.STREAM.DISCONNECT, async () => {
  console.log("Stream Disconnected");
});
