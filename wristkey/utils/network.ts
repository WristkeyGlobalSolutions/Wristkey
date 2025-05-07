import { ethers } from 'ethers';
import axios, { AxiosResponse } from 'axios';

const POLYGON_RPC = 'https://polygon-rpc.com';
export const ETHERSCAN_URL = "https://api.polygonscan.com/api";


export let provider : ethers.JsonRpcProvider | ethers.BrowserProvider;
export let network : Promise<ethers.Network>;

//Used to connect to the network
export async function connectNetwork()
{
    //provider = new ethers.JsonRpcProvider(POLYGON_RPC);
    provider = new ethers.BrowserProvider((window as any).ethereum)
    network = provider.getNetwork();

    return (await network).chainId.toString();
}



