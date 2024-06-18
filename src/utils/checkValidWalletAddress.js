import { ethers } from 'ethers';

export function checkValidWalletAddress(address) {
    // Basic check for length and prefix
    if (!address || address.length !== 42 || !address.startsWith('0x')) {
        return false;
    }

    // Check for valid hex characters
    const hexRegex = /^0x[0-9A-Fa-f]{40}$/;
    if (!hexRegex.test(address)) {
        return false;
    }

    // Use ethers.js to validate the checksum
    try {
        const checksumAddress = ethers.getAddress(address);
        return checksumAddress === address;
    } catch (error) {
        return false;
    }
}

// console.log(checkValidWalletAddress("0x8bbc2Cc76DC3f6D1CC5E9FE855D66AdB6828B9fe"));