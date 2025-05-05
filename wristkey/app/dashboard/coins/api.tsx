"use client";
import axios from "axios";
import {Network, Alchemy, Nft, GetFloorPriceResponse, TokenAddressRequest, TokenMetadataResponse, TokenPriceByAddressResult, AssetTransfersCategory, AssetTransfersResponse, BaseNftCollection, FloorPriceError} from "alchemy-sdk";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ALCgetTokens } from "../mining/managewallets/api";

const settings = {
	apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
	network: Network.ETH_MAINNET,
};

type TrendingData = 
{
    trending_tokens: Token[] | null;
    trending_nfts: NFTCollection[] | null;
};


//Optimized trending to now be a once go on run!!
const trendingContext = createContext<TrendingData | undefined>(undefined);

export const TrendingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const fetched = useRef(false);
    const [trending_tokens, setTokens] = useState<Token[] | null>(null);
    const [trending_nfts, setNFTs] = useState<NFTCollection[] | null>(null);

    useEffect(() => 
    {
        if (fetched.current) return;
        fetched.current = true;

        const fetchTrendingData = async () => 
        {
            try 
            {
                const [tokenData, nftData] = await Promise.all([
                    getTrendingTokenList(alchemy, 10),
                    getTrendingNFTList(alchemy, 5),
                ]);

                setTokens(tokenData);
                setNFTs(nftData);
            } 
            catch(error) 
            {
                console.error("Failed to fetch trending data:", error);
            }
        }

        let alchemy = new Alchemy(settings);

        fetchTrendingData();
        }, []);

    return (
    <trendingContext.Provider value={{ trending_tokens: trending_tokens, trending_nfts: trending_nfts }}>
        {children}
    </trendingContext.Provider>
    );
};

export const useTrending = () => 
{
    const context = useContext(trendingContext);
    if (!context) throw new Error("useTrending must be used within a TrendingProvider");
    return context;
};

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
        
        //TODO : UNCOMMENT THIS!!!!!!!!!!!!!!!!
        //placeholder as this call has limits
        /*
        token_pricing = {    
            network: "network test",
            address: "address placeholder",
            prices: [],
            error: null
        };
        */
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

//Be careful with how many hours you call our from! This can take a while
//Try to get this on some backend and make it pingable

//Count is amount per block, hour is how many blocks it should check from
//Look into desk screeners || coin geckos --> switch back to coingecko

export async function getTrendingTokenList(alchemy : Alchemy, splice : number, count : number = 1000, hours : number = 24)
{
    let tokens = await getTrending(alchemy, splice, [AssetTransfersCategory.ERC20], count, hours);

    let ret : Token[] = [];

    for(let pair of tokens)
    {
        let token = await TokenFromContract(alchemy, pair[0]);

        //Checks in place to get valid tokens
        if(!token)
        {
            continue;
        }

        //TODO: UNCOMMENT THIS WHEN YOU WENT RELIABLE DATA
        //This value is the USD used to preview the price, we need it
        if(!token.token_addresses || !token.token_addresses.prices[0])
        {
            continue;
        }

        ret.push(token);

    }

    return ret;
}

export async function getTrendingNFTList(alchemy : Alchemy, splice : number, count : number = 1000, hours : number = 24)
{
    let nfts = await getTrending(alchemy, splice, [AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155], count, hours);

    let ret : NFTCollection[] = [];

    for(let pair of nfts)
    {
        let nft = await NFTFromContract(alchemy, pair[0]);

        //Checks in place to get valid collections
        if(!nft)
        {
            continue;
        }

        //This value is used for the floor pricing so make sure we have it
        if(!nft.floor_pricing || ((nft.floor_pricing.openSea as FloorPriceError).error))
        {
            continue;
        }

        if(!nft.contract_address)
        {
            continue;
        }

        ret.push(nft);
    }

    return ret;   
}

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
