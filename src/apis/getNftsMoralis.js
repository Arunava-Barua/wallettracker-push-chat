import Moralis from "moralis";

// Eth, Pol, Bsc, Arb
const CHAINS = ["0x1", "0x89", "0x38", "0xa4b1"];
const COVALENT_API_KEY= process.env.COVALENT_API_KEY;

await Moralis.start({
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImY5NTRhNjgxLTAwNDUtNDNkMy1iYjkxLWYxYTBiOGEwMWM5YyIsIm9yZ0lkIjoiMjI4NTY4IiwidXNlcklkIjoiMjI5MTg1IiwidHlwZUlkIjoiMTUzYmFjNjYtYmFlMS00YzhlLWFiMDAtNmM3YmJmMjA3OGYzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODMxMjQ0NTEsImV4cCI6NDgzODg4NDQ1MX0.bMwmShjXh4mKFoA8OgfOz8m2mV5wf6Ti1LnKkiKC8HI",
});

export const getNfts = async (address, chainIndex) => {
  try {

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: CHAINS[chainIndex].toString(),
      format: "decimal",
      mediaItems: false,
      excludeSpam: true,
      // address: "0xcB034160f7B45E41E6015ECEA09F31A66C144422",
      address: address,
    });

    // console.log(response.raw.result.slice(0, 10));

    // const relevantResults = response.raw.result.slice(0, 10);
    const data = response.raw.result;

    const results = [];

    data.map((nft, index) => {
      const nftMetadata = JSON.parse(nft.metadata);

      results.push(nftMetadata);
    });

    // console.log(results)
    return results;
  } catch (e) {
    console.error(e);
  }
};
