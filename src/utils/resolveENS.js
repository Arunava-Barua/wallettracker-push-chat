import { ethers } from 'ethers';
import 'dotenv/config'

const ETH_RPC_PROVIDER = process.env.ETH_RPC_PROVIDER

export async function resolveENS(ensName) {
    try {
        const provider = new ethers.JsonRpcProvider(ETH_RPC_PROVIDER);
        const resolvedAddress = await provider.resolveName(ensName);

        console.log("Resolved address from ENS file: ", resolvedAddress)

        if (resolvedAddress) {
            return resolvedAddress;
        }

        return { error: true, message: 'Error while resolving ENS address' }

    } catch (error) {
        return { error: true, message: 'Error while resolving ENS address' }
    }
}