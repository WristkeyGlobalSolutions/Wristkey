"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import * as network from "@/utils/network";
import * as API from "./api";
import CoinCard from "@/components/coinCard";
import { Console } from "console";
import axios from "axios";

export default function Coins() {
	const [networkid, setNetworkID] = useState<string | null>(null);
	const [trending_tokens, setTrendingTokens] = useState<
    API.PreviewTokenObject[] | null
    >(null);
	const [trending_nfts, setTrendingNFTs] = useState<
    API.PreviewNFTObject[] | null
	>(null);
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

	//Anything updated on startup should go here
	useEffect(() => {
		const fetchTokens = async () => {
			setTrendingTokens(await API.getTrendingTokens());
		};

		const fetchNFTs = async () => {
			setTrendingNFTs(await API.getTrendingNFTs());
		};

		const fetchNetwork = async () => {
			setNetworkID(await network.connectNetwork());
		};

		//Connect to network on startup
		fetchNetwork();

		//Fetch trending Tokens
		fetchTokens();

		//fetch trending NFTs
		fetchNFTs();
	}, []);

	return (
		<>
			<div className="main container mx-auto p-6 space-y-8">
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

				<div className="trendingList space-y-6">
					<div></div>
					<p className="text-lg font-semibold">Trending Coins:</p>
					{trending_tokens ? (
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{trending_tokens.map((token, index) => (
								<li key={index}>
									<CoinCard
										name={token.name}
										thumb={token.image_thumb}
										price={token.price_btc + " BTC"}
                                        identifier={"token"}
                                        id={token.id}
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
										name={nft.name}
										thumb={nft.image_thumb}
										price={`${nft.native_currency_symbol} ${nft.floor_price_in_native_currency}`}
										volume={`${nft.h24_volume}`}
                                        id={nft.id}
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
		</>
	);
}
