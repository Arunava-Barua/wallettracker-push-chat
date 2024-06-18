import { Resolution } from "@unstoppabledomains/resolution";
import 'dotenv/config'

const UD_API_KEY = process.env.UD_API_KEY;

export async function resolveUD(domain, currency='ETH') {
  console.log(domain);
  try {
    const resolution = new Resolution({
      apiKey: UD_API_KEY,
    });

    const resolvedAddress = await resolution.addr(domain, currency)

    console.log("Resolved Address: ", resolvedAddress);
    return resolvedAddress;
  } catch (error) {
    return { error: true, message: "Error while resolving ENS address" };
  }
}

// await resolveUD('brad.crypto', 'ETH');
