"use client";
import axios from "axios";

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


//Gets a list of the top 10 trending Tokens
export async function getTrendingTokens(): Promise<PreviewTokenObject[]> 
{
    try 
    {
        const response = await axios.get(process.env.NEXT_PUBLIC_COINGECKO_URL + 'search/trending');
        const trending = response.data.coins.map((coin: any) => 
        ({
            id: coin.item.id,
            name: coin.item.name,
            symbol: coin.item.symbol,
            image_thumb: coin.item.thumb,
            image_large: coin.item.large,
            price_btc: coin.item.price_btc,
            price_usd: coin.item.data.price,
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
export async function getTrendingNFTs(): Promise<PreviewNFTObject[]> 
{
    try 
    {
        const response = await axios.get(process.env.NEXT_PUBLIC_COINGECKO_URL + 'search/trending');
        const trending = response.data.nfts.map((nft: any) => 
        ({
            id: nft.id,
            name: nft.name,
            symbol: nft.symbol,
            image_thumb: nft.thumb,
            native_currency_symbol: nft.native_currency_symbol,
            floor_price_in_native_currency : nft.floor_price_in_native_currency,
            h24_volume : nft.data.h24_volume
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
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                image_thumb: coin.thumb,
                image_large: coin.large,
                price_btc: "",
                price_usd: "",
            })),

            nfts: response.data.nfts.map((nft : any) =>
            ({
                id: nft.id,
                name: nft.name,
                symbol: nft.symbol,
                image_thumb: nft.thumb,
                native_currency_symbol: "",
                floor_price_in_native_currency : "",
                h24_volume : ""
            }))
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
