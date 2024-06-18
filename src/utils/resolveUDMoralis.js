import 'dotenv/config'

const key = process.env.MORALIS_API_KEY

import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

const resolveUDMoralis = async (domain = "marwan.unstoppable") => { // .crypto, .polygon, 
  try {
    await Moralis.start({
      apiKey: key,
      // ...and any other configuration
    });

    //   const domain = "brad.crypto";

    const response = await Moralis.EvmApi.resolve.resolveDomain({
      domain,
    });

    console.log("Response: ", response)

    const addressObj = response.toJSON();

    console.log(response.toJSON());

    return addressObj.address;
  } catch (error) {
    console.log("Resolve UD moralis error: ", error);
    return { error: true, message: "Error resolving UD using moralis" };
  }
};

resolveUDMoralis();
