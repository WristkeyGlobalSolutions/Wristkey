import { ethers, Wallet } from 'ethers';
import { provider, network, ETHERSCAN_URL} from '@/utils/network';
import axios from 'axios';

//const POLYGON_RPC = 'https://rpc-mumbai.maticvigil.com';

let wallet_addresses : string[] = [];

export type WalletTokenObject =
{
    name : string;
    balance : string;
    decimals : string;
    image_logo : string;
    symbol : string;
    image_thumbnail : string;
    token_address : string;
}

//const CONTRACT_ADDRESS = 'your_contract_address';
//const ABI: ethers.Interface | ethers.InterfaceAbi = [/* contract ABI */];

//This was in here prior
export function getSigner() 
{
    if (typeof window !== 'undefined' && (window as any).ethereum) 
    {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        return provider.getSigner();
    }
    return null;
};

/*

export const getContract = async () => 
{
   const signer = await getSigner();
   if (!signer) throw new Error('No signer available');
   return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}
*/

//Utility Methods

//Would we even need this? Is the ABI provided by default?
async function getABI(contractAddress : string | ethers.Addressable)
{
    const url = ETHERSCAN_URL + `?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHSCAN_KEY}`;
    let ABI : ethers.InterfaceAbi = [];

    try
    {
        const response = await fetch(url);
        const data = await response.json();
    
        if (data.status === "1") 
        {
            ABI = JSON.parse(data.result);
        }
        else
        {
            return data.status;
        }
    }
    catch(error)
    {
        return -1;
    }

    return ABI;
}


//Connects a wallet via Metamask / etherium extention
export async function connectWalletViaExtention()
{
    if(typeof window.ethereum !== "undefined") 
    {
        try 
        {
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
            addWallet(accounts[0]);
            return accounts[0];
        } 
        catch(error) 
        {
            console.error("Wallet connection failed", error);
        }
        } 
        else 
        {
            alert("Please install MetaMask or a Web3 wallet.");
        }
}

//This seems to be super unsafe
export async function connectWalletViaPhrase(phrase : string)
{
    try
    {
        const wallet = Wallet.fromPhrase(phrase);
        addWallet(wallet.address);       
    }
    catch(error)
    {
        return -1;
    }
}

export async function connectWalletViaAddress(address : string)
{
    let tokens : WalletTokenObject[] = await getTokens(address);

    tokens.forEach(token =>
    {
        console.log(token.name + " " + ethers.formatUnits(token.balance, token.decimals));
        console.log(token);
    });

    addWallet(address);
}

export async function getWallets()
{
    return wallet_addresses;
}

function addWallet(wallet_address : string)
{
    if(!wallet_addresses.includes(wallet_address))
    {
        wallet_addresses.push(wallet_address);
    }
}

function removeWallet(wallet_address : string)
{
    wallet_addresses.filter(address => address == wallet_address);
}

export async function createWallet()
{
    if(provider)
    {
        const new_wallet = Wallet.createRandom(provider);
        new_wallet.connect(provider);
        addWallet(await new_wallet.getAddress());
        return await new_wallet.getAddress();
    }
    else
    {
        return -1;
    }
}

export async function createWalletFromPrivateKey(privateKey : string)
{
    if(provider)
    {
        const new_wallet = new Wallet(privateKey, provider);
        new_wallet.connect(provider);
        addWallet(await new_wallet.getAddress());
        return await new_wallet.getAddress();
    }
    else
    {
        return -1;
    }
}

export async function getContract(contractAddress : string | ethers.Addressable, ABI? : ethers.InterfaceAbi | Promise<any>)
{
    if(!contractAddress)
    {
        return -3;
    }

    //If an ABI was not provided to us, see if it is deployed and grab it
    if(!ABI)
    {
        ABI = await getABI(contractAddress);

        //Failed to fetch ABI
        const status = (await ABI).status;
        if(status !== "1")
        {
            return -2;
        }
    }

    if(provider)
    {
        const contract = new ethers.Contract(contractAddress, await ABI, provider);
        return contract;
    }
    else
    {
        return -1;
    }
}

//I'm not 100% sure what this returns yet. Still working out the kinks
export async function getTokens(address : ethers.AddressLike) : Promise<WalletTokenObject[]>
{
    const response = await fetch(`https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=eth`, {
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_KEY as string
        }
      });
    
    const tokens = await response.json();

    const ret_tokens = tokens.map((coin: any) => 
    ({
        name: coin.name,
        balance: coin.balance,
        decimals: coin.decimals,
        image_logo: coin.logo,
        symbol: coin.symbol,
        image_thumbnail: coin.thumbnail,
        token_address: coin.token_address
    })        
    );

    return ret_tokens;
}
  
