// script.js

import { exec } from "child_process";
import fs from "fs";
import readline from "readline";

// Commands
const commands = ["npm install"];

// Function to execute a shell command
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${command}: ${error}`);
        reject(error);
      } else {
        // console.log(`Executed: ${command}`);
        console.log(`${command} executed successfully`);
        resolve(stdout ? stdout : stderr);
      }
    });
  });
};

// Function to check if a file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error(`Error checking ${filePath} existence: ${err}`);
    return false;
  }
};

// Function to prompt user for input
const promptInput = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

// Function to write to .env file
const writeToEnvFile = (content) => {
  fs.writeFileSync("./.env", content);
  console.log("\n.env file updated successfully!");
};

const banner = () => {
  console.log("\n**********************************************************");
  console.log("///////////////// WALLET TRACKER CHAT SETUP //////////////");
  console.log("**********************************************************\n");
};

const executeAllCommands = async () => {
  // Execute each command sequentially
  for (let command of commands) {
    try {
      await executeCommand(command);
    } catch (error) {
      console.error(`Failed to execute ${command}: ${error}`);
      process.exit(1); // Exit with error
    }
  }
};

const run = async () => {
  // Example: Prompt user for environment variables
  const pvtKey = await promptInput("Enter your Private Key: ");
  const ethRpc = await promptInput("Enter Ethereum RPC provider: ");
  const covalentKey = await promptInput("Enter your Covalent Key: ");
  const udApiKey = await promptInput("Enter your UD Api Key: ");
  const udSdkKey = await promptInput("Enter your UD SDK Key: ");
  const moralisKey = await promptInput("Enter your Moralis Key: ");
  const coindarKey = await promptInput("Enter your Coindar Key: ");

  // Example: Write environment variables to .env file
  const envContent = `PRIVATE_KEY=${pvtKey}\nETHEREUM_RPC_PROVIDER=${ethRpc}\nCOVALENT_API_KEY=${covalentKey}\nUD_API_KEY=${udApiKey}\nUD_SDK_KEY=${udSdkKey}\nMORALIS_API_KEY=${moralisKey}\nCOINDAR_API_KEY=${coindarKey}\n`;
  writeToEnvFile(envContent);

  // Execute all  the commands in pipeline
  await executeAllCommands();
};

// Main function to execute commands and populate .env file
const main = async () => {
  // Display Banner
  banner();

  if (fileExists("./.env")) {
    console.log("You already have `.env` file present!");
    const overwrite = await promptInput(
      "\nDo you want to overwrite [Y]/[N] ? "
    );

    if (overwrite.charAt(0).toUpperCase() == "Y") {
      // Run the setup
      await run();
      console.log("\n\nRun `npm start` to fire up your application.");
    }

    if (overwrite.charAt(0).toUpperCase() == "N") {
      console.log("\nExecuting `npm install`. Please wait...");

      // Run the setup
      await executeAllCommands();
      console.log("\n\nRun `npm start` to fire up your application.");
    }
  } else {
    // Run the setup
    await run();
    console.log("\n\nRun `npm start` to fire up your application.");
  }
};

// Start main execution
main();
