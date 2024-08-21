import shortener from "node-url-shortener";

export const urlShortener = (longUrl) => {
  let shortenedUrl = "";
  console.log(longUrl)

  const varibale = shortener.short(longUrl, function (err, url) {
    shortenedUrl = url;
    console.log(shortenedUrl)
    console.log(url);

    return shortenedUrl;
  });

  return shortenedUrl;
};

// console.log(urlShortener("app.uniswap.org/#/add/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/500"))
