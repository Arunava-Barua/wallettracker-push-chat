// Get the number of top NFTs the user wants - DONE
// Get NFT metadatas from MoralisSDK (no spam filter) - DONE
// Check if image exist, if exist then get the compressed base64 image and add the metadata to an array
// If image tag has base64 encoded data, compress it to make it compatible
// The loop breaks in 2 conditions - i) If there are no more NFTs in the wallet, ii) If arr.length == noOfTopNfts user wants - DONE
// A loop for all the metadatas saved to send NFT names and image
/*
{
    name: '$ETH NFT EVENT',
    description: "Discover Coinbase's exclusive event-themed NFT, a unique digital collectible distributed randomly to users, redeemable on our website for 1 ether, offering an exceptional experience and a gateway to the future of finance.",
    image: 'https://ethercbase.com/image.png',
    attributes: [ [Object], [Object] ]
  }
*/
import { getNfts } from "../apis/getNftsMoralis.js";
import { isUrlWorking } from "../utils/isUrlWorking.js";
import { isValidUrl } from "../utils/isValidUrl.js";
import { isBase64Encoded } from "../utils/isBase64Encoded.js";
import { fetchImageAsBase64 } from "../utils/fetchImageAsBase64.js";
import { resizeAndCompressBase64Image } from "../utils/resizeAndCompressBase64Image.js";

const width = 800;
const height = 600;
const quality = 85;

export const getTopNfts = async (address, chainIndex, noOfNfts) => {
  try {
    const nfts = await getNfts(address, chainIndex);
    const nftArr = [];

    for (let i = 0; i < nfts.length; i++) {
      const nft = nfts[i];

      if (nftArr.length >= noOfNfts) {
        break;
      }

      if (!nft.image) {
        continue;
      }

      // 1. Check for URL or base64 encoded image response
      const isUrl = isValidUrl(nft.image);
      const isBase64 = isBase64Encoded(nft.image.split(",")[1]); // .split(",")[1]

      // neither
      if (!isUrl && !isBase64) {
        continue;
      }

      // isUrl
      if (isUrl) {
        const imageExists = await isUrlWorking(nft.image);

        if (!imageExists) {
          continue;
        }

        const imageBase64 = await fetchImageAsBase64(
          nft.image,
          width,
          height,
          quality
        );

        const nftData = {
          name: nft.name,
          imageUrl: nft.image,
          imageBase64: imageBase64,
        };

        nftArr.push(nftData);
      }

      // isBase64
      if (isBase64) {
        console.log("In isBase64");
        const base64Image = nft.image;

        const compressedBase64 = await resizeAndCompressBase64Image(
          base64Image,
          width,
          height,
          quality
        );

        const nftData = {
          name: nft.name,
          imageUrl: nft.image,
          imageBase64: compressedBase64,
        };

        nftArr.push(nftData);
      }
    }

    // return data
    return nftArr;
  } catch (error) {
    console.log("Error while getting top NFTs: ", error);
    return {
      error: true,
      message: "Something went wrong while getting top NFTs.",
    };
  }
};

// end here
// Tests start

// const response = await getTopNfts(
//   "0xcB034160f7B45E41E6015ECEA09F31A66C144422",
//   1,
//   10
// );

// console.log(response);
// // console.log(response.length)

// for (let i = 0; i < response.length; i++) {
//   const nft = response[i];

//   const recipient = "0x048f42e56DDF2E3737D55676609F148059DBa267";

//   await userAlice.chat.send(recipient, {
//     type: 'Text',
//     content: `${nft.name}`,
//   });

//   await userAlice.chat.send(recipient, {
//     type: "Image",
//     content: `{"content":"${nft.imageBase64}"}`,
//   });

//   console.log("Text & Image sent successfully");
// }
