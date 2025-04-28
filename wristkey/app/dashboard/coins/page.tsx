"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import * as network from "@/utils/network";
import * as API from "./api";
import CoinCard from "@/components/coinCard";
import WalletNav from "@/components/UI/WalletNav";
import { Network, Alchemy, FloorPriceMarketplace } from "alchemy-sdk";

const settings = {
	apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
	network: Network.ETH_MAINNET,
};

export default function Coins() {
	const [networkid, setNetworkID] = useState<string | null>(null);
	const [trending_tokens, setTrendingTokens] = useState<Token[]>([]);
	const [trending_nfts, setTrendingNFTs] = useState<
		API.NFTCollection[] | null
	>(null);

	/*
	const [search, setSearch] = useState<
    API.GeckoSearchQuery | null
	>(null);
    
    async function handleSearch(event : React.KeyboardEvent<HTMLInputElement>)
    {
        if(event.code == "Enter" && event.currentTarget.id == "TokenNFTSearchBar")
        {
            let input = (document.getElementById("TokenNFTSearchBar") as HTMLInputElement).value;
            let output : API.GeckoSearchQuery | null = await API.searchGecko(input);

            if(output)
            {
                setSearch(output);
            }
            else
            {
                setSearch(null);
            }
        }
        else
        {
            setSearch(null);
        }
    }
        */

	useEffect(() => {
		console.log("Trending Tokens: ", trending_tokens);
		console.log("Trending NFTs: ", trending_nfts);
	}, [trending_tokens, trending_nfts]);

	interface Token {
		name: string;
		thumb: string | null;
		price: string;
		address: string;
	}

	//Anything updated on startup should go here
	useEffect(() => {
		async function fetchTokens() {
			console.log("Fetching Tokens...");
			const tokens = (await API.ALCgetTrendingTokens(alchemy)).slice(
				0,
				10
			);
			const tokens_defined: Token[] = await Promise.all(
				tokens.map(async (val: [string, number]) => {
					const token = await API.TokenFromContract(alchemy, val[0]);

					if (token) {
						return {
							name: token.metadata.name || "Unknown",
							thumb: token.metadata.logo,
							price: token.token_addresses.prices[0]
								? token.token_addresses.prices[0].currency +
								  " " +
								  token.token_addresses.prices[0].value
								: "N/A",
							address: token.token_addresses.address,
						};
					}
					return null;
				})
			).then(
				(results) =>
					results.filter((token) => token !== null) as Token[]
			);

			console.log("Tokens Defined: ", tokens_defined);

			setTrendingTokens(tokens_defined);
		}

		async function fetchNFTs() {
			const nfts = (await API.ALCgetTrendingNFTs(alchemy)).slice(0, 10);

			const nft_defined: API.NFTCollection[] = await Promise.all(
				nfts.map(async (val: [string, number]) => {
					const nft = await API.NFTFromContract(alchemy, val[0]);
					return nft || null;
				})
			).then(
				(results) =>
					results.filter((nft) => nft !== null) as API.NFTCollection[]
			);

			setTrendingNFTs(nft_defined);
		}

		const fetchNetwork = async () => {
			setNetworkID(await network.connectNetwork());
		};

		const alchemy = new Alchemy(settings);

		//Connect to network on startup
		fetchNetwork();

		//Fetch trending Tokens
		fetchTokens();

		//fetch trending NFTs
		fetchNFTs();
	}, []);

	return (
		<div className="bg-gradient-to-r from-blue-700 to-blue-950">
			<div className="bg-gray-100 rounded-t-3xl flex h-screen">
				<div className="w-auto md:w-1/3 lg:w-1/5 2xl:w-1/5 flex place-content-center mt-20">
					<WalletNav />
				</div>
				<div className="w-auto md:w-2/3 lg:w-4/5 2xl:4/5">
			<div className="main container mx-auto p-2 space-y-8">
				<div className="networkStatus text-center">
					{networkid ? (
						<p className="text-lg font-semibold text-green-600">
							Network ID: {networkid}
						</p>
					) : (
						<p className="text-lg font-semibold text-red-600">
							Not Connected to Network
						</p>
					)}
				</div>

				<div className="trendingList space-y-6">
					<div></div>
					<p className="text-lg font-semibold">Trending Coins:</p>
					{trending_tokens ? (
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{trending_tokens.map((token, index) => (
								<li key={index}>
									<CoinCard
										name={token.name}
										thumb={token.thumb}
										price={token.price}
										address={token.address}
										identifier={"token"}
									/>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500">No Trending Tokens</p>
					)}
				</div>

				<div>
					<p className="text-lg font-semibold">Trending NFTs:</p>
					{trending_nfts ? (
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{trending_nfts.map((nft, index) => (
								<li key={index}>
									<CoinCard
										name={nft.nfts[0].collection?.name}
										thumb={
											nft.nfts[0].collection
												?.bannerImageUrl
										}
										price={`${
											(
												nft.floor_pricing
													.openSea as FloorPriceMarketplace
											).floorPrice
												? (
														nft.floor_pricing
															.openSea as FloorPriceMarketplace
												  ).floorPrice
												: 0
										}`}
										address={nft.nfts[0].contract.address}
										identifier={"nft"}
									/>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500">No Trending NFTs</p>
					)}
				</div>
			</div>
			<div className="directory text-center space-x-4">
				<Link
					href="/staking"
					className="text-blue-600 underline hover:text-blue-800"
				>
					Staking
				</Link>
				<Link
					href="/security"
					className="text-red-600 underline hover:text-red-800"
				>
					Security
				</Link>
				<Link
					href="/auth"
					className="text-green-600 underline hover:text-green-800"
				>
					Login
				</Link>
				<Link
					href="/auth"
					className="text-yellow-600 underline hover:text-yellow-800"
				>
					Register
				</Link>
			</div>
		</div>
		</div>
		</div>
	);
}

{
	/**
    <div className="search-bar space-y-2">
    <label className="block text-sm font-medium text-gray-700">
        Search:
    </label>
    <input
        type="text"
        id="TokenNFTSearchBar"
        name="TokenNFTSearchBar"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search Tokens and NFTs..."
        style={{color: "black"}}
        onKeyDown={(event) => handleSearch(event)}
    />

    <div className="searchResult space-y-6">
        <div></div>

        {search ? (
            <div>
            <p className="text-lg font-semibold">Tokens: ({search.tokens.length})</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {search.tokens.map((token, index) => (
                    <li key={index}>
                    <CoinCard
                        name={token.name}
                        thumb={token.image_thumb}
                        price={""}
                        id ={token.id}
                        identifier={"token"}
                    />
                </li>
                ))}
            </ul>
            <p className="text-lg font-semibold">NFTs: ({search.nfts.length})</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {search.nfts.map((nft, index) => (
                <li key={index}>
                    <CoinCard
                        name={nft.name}
                        thumb={nft.image_thumb}
                        price={""}
                        id={nft.id}
                        identifier={"nft"}
                    />
                </li>
                ))}
            </ul>
            </div>
        ) : (
            <p></p>
        )}
    </div>
</div>
*/
}
