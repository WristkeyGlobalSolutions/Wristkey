import { ethers, Wallet } from 'ethers';

//const POLYGON_RPC = 'https://rpc-mumbai.maticvigil.com';
const POLYGON_RPC = 'https://polygon-rpc.com';
const ETHSCAN_KEY = "E3WIWE6CM7M8ACACG8G3863JF9B7GY9Q3U";

let provider : ethers.JsonRpcProvider;
let network : Promise<ethers.Network>;
let smart_contracts : ethers.Contract[] = [];
let wallet_addresses : string[] = [];

//const CONTRACT_ADDRESS = 'your_contract_address';
//const ABI: ethers.Interface | ethers.InterfaceAbi = [/* contract ABI */];

/*
export const getSigner = () => {
   if (typeof window !== 'undefined' && (window as any).ethereum) {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
     return provider.getSigner();
   }
   return null;
};

export const getContract = async () => 
{
   const signer = await getSigner();
   if (!signer) throw new Error('No signer available');
   return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}
*/

//Utility Methods
async function getABI(contractAddress : string | ethers.Addressable)
{
    const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHSCAN_KEY}`;
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

//Contract Sotrage
function addContract(contract : ethers.Contract)
{
    if(smart_contracts.length == 0)
    {
        smart_contracts.push(contract);
    }

    smart_contracts.forEach(stored_contract => {
        if(stored_contract.getAddress() == contract.getAddress())
        {
            return;
        }
    });  
    
    smart_contracts.push(contract);
}

function removeContract(contract_or_address : ethers.Contract | Promise<string>)
{
    if(smart_contracts.length == 0)
    {
        return;
    }
    
    //Remove the contract(s) from the list
    if(contract_or_address instanceof ethers.Contract)
    {
        smart_contracts = smart_contracts.filter(stored_contract => stored_contract.getAddress() == contract_or_address.getAddress());
    }
    else
    {
        smart_contracts = smart_contracts.filter(stored_contract => stored_contract.getAddress() == contract_or_address);
    }
}

export const connectNetwork = async () =>
{
    provider = new ethers.JsonRpcProvider(POLYGON_RPC);
    network = provider.getNetwork();

    return (await network).chainId.toString();
}

export const connectWallet = async () =>
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

export const getWallets = async () =>
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


export const createWallet = async () =>
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

export const createWalletFromPrivateKey = async (privateKey : string) =>
{
    if(provider)
    {
        const new_wallet = new Wallet(privateKey, provider);
        new_wallet.connect(provider);
        return new_wallet;
    }
    else
    {
        return -1;
    }
}

export const connectContract = async (contractAddress : string | ethers.Addressable, ABI? : ethers.InterfaceAbi | Promise<any>) => 
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
        addContract(contract);
        
        return await contract.getAddress();
    }
    else
    {
        return -1;
    }
}
  
export const getBalance = async (address : ethers.AddressLike) =>
{
    if(provider)
    {
        return (await provider.getBalance(address));
    }
    else
    {
        return "No RPC Provider";
    }
}
  
