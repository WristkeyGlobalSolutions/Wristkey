"use client";
import axios from "axios";
import {Network, Alchemy, Nft, GetFloorPriceResponse, TokenAddressRequest, TokenMetadataResponse, TokenPriceByAddressResult, AssetTransfersCategory, AssetTransfersResponse, BaseNftCollection} from "alchemy-sdk";
import { useMemo } from "react";




/*
//Documentation: https://docs.coingecko.com/reference/trending-search
export type PreviewTokenObject = 
{
    id: string;
    name: string;
    symbol: string; //Currency symbol
    image_thumb: string; //Icon for this Token
    image_large: string;

    price_btc : number;
    price_usd : number;
}

export type PreviewNFTObject = 
{
    id: string;
    name: string;
    symbol: string;
    image_thumb: string;
    native_currency_symbol: string;
    h24_volume : string;

    floor_price_in_native_currency : number;
}

export type DetailedTokenObject = 
{
    id : string;
    name : string;
    symbol : string; //Currency symbol
    image_large : string;
    image_small : string;
    image_thumb : string;
    description : string;

    prices : {[currency_code: string]: number}; //list of prices given a 3-character currency coe (ex: usd)
}

export type DetailedNFTObject =
{
    id : string;
    contract_address : string;
    name : string;
    symbol : string;
    image_small : string;
    image_banner : string;
    description : string;
    native_currency : string;
    native_currency_symbol : string;

    floor_price : {[currency_type : string]: number}; //currency type is either 'native_currency' or 'usd'
}

export type GeckoSearchQuery =
{
    nfts: PreviewNFTObject[];
    tokens: PreviewTokenObject[];
}
*/

/*
export async function getNFT(id : string) : Promise<DetailedNFTObject | null>
{
    try 
    {
        const response = await axios.get(process.env.NEXT_PUBLIC_COINGECKO_URL + 'nfts/' + id);
        let nft = response.data;

        let ret : DetailedNFTObject =
        {
            id: nft.id,
            contract_address: nft.contract_address,
            name: nft.name,
            symbol: nft.symbol,
            image_small: nft.image.small,
            image_banner: nft.banner_image,
            description: nft.description,
            native_currency: nft.native_currency,
            native_currency_symbol: nft.native_currency_symbol,
            
            floor_price : nft.floor_price
        }

        return ret;
    }
    catch(error)
    {
        console.error("Error find NFT:", error);
        return null;    
    }   
}
*/

/*
export async function getToken(id : string) : Promise<DetailedTokenObject | null>
{
    try 
    {
        const options = 
        {
            method: 'GET',
            url: process.env.NEXT_PUBLIC_COINGECKO_URL + 'coins/' + id,
            headers: {accept: 'application/json'}
        };

        let response = await axios.request(options);
        let coin = response.data;
        console.log(coin);

        let ret : DetailedTokenObject =
        {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            image_thumb: coin.image.thumb,
            image_large: coin.image.large,
            image_small: coin.image.small,
            prices: coin.market_data.current_price,
            description : coin.description.en
        }

        return ret;
    }
    catch(error)
    {
        console.error("Error finding Token:", error);
        return null;    
    }  
}
*/

//Gets a list of the top 10 trending Tokens
export async function getTrendingTokens(): Promise<Token[]> 
{
    try 
    {
        const response = await axios.get(process.env.NEXT_PUBLIC_COINGECKO_URL + 'search/trending');

        let trending : Token[] = [];

        trending = response.data.coins.map((coin: any) => 
            ({
                name: coin.item.name,
                image: coin.item.thumb,
                id: coin.item.id
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
export async function getTrendingNFTs(): Promise<NFTCollection[]> 
{
    try 
    {
        const response = await axios.get(process.env.NEXT_PUBLIC_COINGECKO_URL + 'search/trending');
        const trending = response.data.nfts.map((nft: any) => 
        ({
            name: nft.name,
            image: nft.thumb,
            id: nft.id
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
        const response = await axios.get(process.env.NEXT_PUBLIC_COINGECKO_URL + 'search/?query=' + input);

        let ret : GeckoSearchQuery =
        {
            tokens: response.data.coins.map((coin : any) => 
            ({
                name: coin.name,
                image: coin.thumb,
                id: coin.id
            })),

            nft_collections: response.data.nfts.map((nft : any) =>
            ({
                name: nft.name,
                image: nft.thumb,
                id: nft.id
            }))
        }

        if(ret.tokens.length == 0 && ret.nft_collections.length == 0)
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

//USING ALCHEMY
export type GeckoSearchQuery =
{
    tokens : Token[],
    nft_collections: NFTCollection[]
}

export type SearchQuery =
{
    tokens : Token[],
    nft_collections: NFTCollection[]
}

export type Token =
{
    metadata: TokenMetadataResponse,
    token_addresses: TokenPriceByAddressResult
};

export type NFTCollection =
{
    nfts: Nft[],
    floor_pricing: GetFloorPriceResponse,
    contract_address: string,
    collection?: BaseNftCollection
};

//Gets a token given a contract
export async function TokenFromContract(alchemy : Alchemy, address : string) : Promise<Token | undefined>
{
    let token_metadata;
    let token_pricing;

    try
    {
        token_metadata = await alchemy.core.getTokenMetadata(address);
    }
    catch(error)
    {
        console.error("Could not obtain token metadata", error);
    }

    try
    {
        token_pricing = (await alchemy.prices.getTokenPriceByAddress(
        [{network: Network.ETH_MAINNET, address: address}])).data[0];
    }
    catch(error)
    {
        console.error("Could not obtain token pricing", error);
    }

    if(token_metadata && token_pricing)
    {
        let token : Token = 
        {
            metadata: token_metadata,
            token_addresses: token_pricing,
        }

        return token;
    }
}

export async function NFTFromContract(alchemy : Alchemy, address : string) : Promise<NFTCollection | undefined>
{
    let nfts;
    let floor_pricing;

    try
    {
        nfts = await alchemy.nft.getNftsForContract(address);
    }
    catch(error)
    {
        console.error("Could not obtain NFT metadata", error);
    }

    try
    {
        floor_pricing = await alchemy.nft.getFloorPrice(address);
    }
    catch(error)
    {
        console.error("Could not obtain token pricing", error);
    }

    if(nfts && floor_pricing)
    {
        let collection : NFTCollection = 
        {
            nfts: nfts.nfts,
            floor_pricing: floor_pricing,
            collection: nfts.nfts[0].collection,
            contract_address: nfts.nfts[0].contract.address
        };

        return collection;
    }   
}

export async function ALCsearch(alchemy : Alchemy, input : string) : Promise<Token | NFTCollection | undefined>
{
    let token = await TokenFromContract(alchemy, input);

    if(!token)
    {
        let nft = await NFTFromContract(alchemy, input);

        if(nft)
        {
            return nft;
        }
    }
    else
    {
        return token;
    }
}

//Sorts through asset transfers and finds the trending tokens
//Number is amount of transfers to look through
export async function ALCgetTrendingTokens(alchemy : Alchemy, splice : number, count : number = 10, hours : number = 24) : Promise<[string, number][]>
{
    return await getTrending(alchemy, splice, [AssetTransfersCategory.ERC20], count, hours);
}

export async function ALCgetTrendingNFTs(alchemy : Alchemy, splice : number, count : number = 10, hours : number = 24) : Promise<[string, number][]>
{
    return await getTrending(alchemy, splice, [AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155], count, hours);
}


//Be careful with how many hours you call our from! This can take a while
//Try to get this on some backend and make it pingable

//Count is amount per block, hour is how many blocks it should check from
//Look into desk screeners || coin geckos --> switch back to coingecko

const SAMPLE_COUNT = 20; // number of random samples
const BLOCK_RANGE = 10; // how many blocks per sample

async function getTrending(alchemy : Alchemy, splice : number, category : AssetTransfersCategory[], count : number, hours : number)
{
    const latest = await alchemy.core.getBlockNumber();
    const earliest = (latest - Math.floor((hours * 60 * 60) / 12));

    let pageKey: string | undefined = undefined;
    const allTransfers : string[] = [];

    for (let i = 0; i < SAMPLE_COUNT; i++)
    {
        const start = Math.floor(Math.random() * (latest - earliest - BLOCK_RANGE)) + earliest;
        const end = (start + BLOCK_RANGE);

        const ret = await alchemy.core.getAssetTransfers({
            fromBlock: `0x${start.toString(16)}`,
            toBlock: `0x${end.toString(16)}`,
            category: category,
            maxCount: count,
        });

        for (let transfer of ret.transfers) {
            if (transfer.rawContract?.address) {
                allTransfers.push(transfer.rawContract.address);
            }
        }
    }

    const counts : {[key: string]: number} = {};
    for(let i = 0; i < allTransfers.length; i++)
    {
        counts[allTransfers[i]] = (counts[allTransfers[i]] || 0) + 1;
    }
    
    const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1]);

    return sorted.splice(0, splice);
}
