import { ethers } from 'ethers';
import axios, { AxiosResponse } from 'axios';

const POLYGON_RPC = 'https://polygon-rpc.com';

//Used to obtain ABI of pre-existing Smart Contracts
export const ETHERSCAN_URL = "https://api.polygonscan.com/api";
export const ETHSCAN_KEY = "E3WIWE6CM7M8ACACG8G3863JF9B7GY9Q3U";

//const NFTGO_URL = "`https://data-api.nftgo.io/";
//const NFTGO_API_KEY = "e2711ea7-e3f7-496b-9fc3-f0289f4370c6";

//Used to get trending data
const COINGECKO_URL = "https://api.coingecko.com/api/v3/";

//const COINMARKETCAP_API_KEY = "496ff11d-c1f3-4998-8dde-e90b131714dd";

export let provider : ethers.JsonRpcProvider;
export let network : Promise<ethers.Network>;

export type GeckoSearchQuery =
{
    nfts: NFTObject[];
    tokens: TokenObject[];
}

//Documentation: https://docs.coingecko.com/reference/trending-search
export type TokenObject = 
{
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
    slug : string;
    price_btc : number;
    score : number;
    data : any; //Additional data, check API Docs
}

export type NFTObject = 
{
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    nft_contract_id : number;
    native_currency_symbol: string;
    floor_price_in_native_currency : number;
    floor_price_24h_percentage_change : number;
    data : any; //Additional data, check API Docs
}

//TODO: Add search functionality to search NFTs and Tokens

//Used to connect to the network
export async function connectNetwork()
{
    provider = new ethers.JsonRpcProvider(POLYGON_RPC);
    network = provider.getNetwork();

    return (await network).chainId.toString();
}

//Gets a list of the top 10 trending Tokens
export async function getTrendingTokens(): Promise<TokenObject[]> 
{
    try 
    {
        const response = await axios.get(COINGECKO_URL + 'search/trending');
        const trending = response.data.coins.map((coin: any) => 
        ({
            id: coin.item.id,
            name: coin.item.name,
            symbol: coin.item.symbol,
            market_cap_rank: coin.item.market_cap_rank,
            thumb: coin.item.thumb,
            large: coin.item.large,
            slug: coin.item.slug,
            price_btc: coin.item.price_btc,
            score: coin.item.score,
            data: coin.item.data
        }));
  
        return trending;
    } 
    catch(error)
    {
        console.error("Error fetching trending tokens:", error);
        return [];
    }
}

//Gets a list of the top 7 trending NFTs
export async function getTrendingNFTs(): Promise<NFTObject[]> 
{
    try 
    {
        const response = await axios.get(COINGECKO_URL + 'search/trending');
        const trending = response.data.nfts.map((nft: NFTObject) => 
        ({
            id: nft.id,
            name: nft.name,
            symbol: nft.symbol,
            thumb: nft.thumb,
            nft_contract_id: nft.nft_contract_id,
            native_currency_symbol: nft.native_currency_symbol,
            floor_price_in_native_currency: nft.floor_price_in_native_currency,
            floor_price_24h_percentage_change: nft.floor_price_24h_percentage_change,
            data: nft.data
        }));

        return trending;
    } 
    catch(error)
    {
        console.error("Error fetching trending NFTs:", error);
        return [];
    }
}

//Default only searches for NFTs and Coins
export async function searchGecko(input : string, limiters : string[] = ["exchanges", "ios"]) : Promise<GeckoSearchQuery | null>
{
    try 
    {
        const response = await axios.get(COINGECKO_URL + 'search/?query=' + input);

        let ret : GeckoSearchQuery =
        {
            tokens: response.data.coins,
            nfts: response.data.nfts
        }

        if(ret.tokens.length == 0 && ret.nfts.length == 0)
        {
            return null;
        }

        return ret;
    }
    catch(error)
    {
        console.error("Error searching Gecko:", error);
        return null;    
    }
}
