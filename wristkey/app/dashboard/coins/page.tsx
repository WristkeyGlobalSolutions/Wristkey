"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import * as network from "@/utils/network";
import * as API from "./api";
import CoinCard from "@/components/coinCard";
import WalletNav from "@/components/UI/WalletNav";
import { Alchemy, FloorPriceMarketplace, Network } from "alchemy-sdk";

let alchemy: Alchemy;

const settings = {
	apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
	network: Network.ETH_MAINNET,
};

export default function Coins() {
    const {trending_tokens, trending_nfts} = API.useTrending();
	const [networkid, setNetworkID] = useState<string | null>(null);

	const [searchToken, setSearchToken] = useState<
		API.Token | undefined | null
	>(null);

	async function handleSearch(event: React.KeyboardEvent<HTMLInputElement>) {
		if (
			event.code == "Enter" &&
			event.currentTarget.id == "TokenSearchBar"
		) {
			const alchemy = new Alchemy(settings);
			const input = (
				document.getElementById("TokenSearchBar") as HTMLInputElement
			).value;

        
			const token = await API.TokenFromContract(alchemy, input);

			if (token) {
				setSearchToken(token);
			} else {
				setSearchToken(null);
			}
		}
	}

	//Anything updated on startup should go here
	useEffect(() => {
		const fetchNetwork = async () => {
			setNetworkID(await network.connectNetwork());
		};

		alchemy = new Alchemy(settings);
		fetchNetwork();
	}, []);

	return (
		<div className="bg-gradient-to-r from-blue-700 to-blue-950">
			<div className="bg-gray-100 rounded-t-3xl flex min-h-screen">
				<div className="w-auto md:w-1/3 lg:w-1/5 2xl:w-1/5 flex place-content-center mt-20">
					<WalletNav currentTab="explore" />
				</div>
				<div className="w-auto md:w-2/3 lg:w-4/5 2xl:4/5">
					<div className="text-center mx-auto p-2 space-y-8">
						<h1 className="text-3xl mr-72 py-4">
							Explore
						</h1>
					</div>
					
					<div className="py-4 w-11/12 flex justify-between">
						<button
							className="p-8 w-48 font-bold text-xl rounded-xl bg-gradient-to-r from-orange-300 to-orange-600"
						>
							Trending
						</button>
						<button
							className="p-8 w-48 font-bold text-xl rounded-xl bg-gradient-to-r from-green-300 to-green-600"
						>
							Top Gainers
						</button>
						<button
							className="p-8 w-48 font-bold text-xl rounded-xl bg-gradient-to-r from-red-300 to-red-600"
						>
							Top Losers
						</button>
						<button
							className="p-8 w-48 font-bold text-xl rounded-xl bg-gradient-to-r from-pink-300 to-pink-600"							
						>
							Top Favorited
						</button>
						<button
							className="p-8 w-48 font-bold text-xl rounded-xl bg-gradient-to-r from-purple-300 to-purple-600"
						>
							Top Searched
						</button>
					</div>

					<div>
						<div className="search-bar space-y-2 w-11/12">
							<input
								type="text"
								id="TokenSearchBar"
								name="TokenSearchBar"
								className="w-full h-16 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
								placeholder="Search by Contract Address..."
								style={{ color: "black" }}
								onKeyDown={(event) => handleSearch(event)}
							/>

							<div className="searchResult space-y-6">
								{searchToken ? (
									<CoinCard
										name={searchToken.metadata.name ?? "N/A"}
										thumb={searchToken.metadata.logo}
										address={searchToken.contract_address}
										identifier={"token"}
									/>
								) : (
									<p></p>
								)}
							</div>

		
						</div>

						

						<div className="w-11/12 py-4">
							<p className="text-lg font-semibold">
								Trending Coins
							</p>
							<div className="flex columns-5 border-b py-2">
								<p className="w-2/5">
									Name
								</p>
								<p className="w-1/5">
									Price
								</p>
								<p className="w-1/5">
									Change
								</p>
								<p className="w-1/5">
									Market Cap
								</p>
								<p className="w-1/5 text-center">
									Favorite
								</p>
							</div>
							
							{trending_tokens ? (
								<ul className="grid grid-cols-1">
									{trending_tokens.map((token, index) => (
										<CoinCard
											key={token.contract_address}
											name={token.metadata.name ?? "N/A"}
											thumb={token.metadata.logo}
											address={token.contract_address}
											identifier={"token"}
										/>
									))}
								</ul>
							) : (
								<p className="text-gray-500">
									Loading trending tokens...
								</p>
							)}
						</div>

						<div className="w-11/12 py-20">
							<p className="text-lg font-semibold">
								Trending NFTs
							</p>
							<div className="flex columns-5 border-b py-2">
								<p className="w-2/5">
									Name
								</p>
								<p className="w-1/5">
									Price
								</p>
								<p className="w-1/5">
									Change
								</p>
								<p className="w-1/5">
									Market Cap
								</p>
								<p className="w-1/5 text-center">
									Favorite
								</p>
							</div>
							{trending_nfts ? (
								<ul className="grid grid-cols-1 gap-4">
									{trending_nfts.map((nft, index) => (
										<li key={index}>
											<CoinCard
												name={nft.collection?.name ?? "N/A"}
												thumb={nft.collection?.bannerImageUrl}
												address={nft.contract_address}
												identifier={"nft"}
											/>
										</li>
									))}
								</ul>
							) : (
								<p className="text-gray-500">
									Loading trending NFTs...
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
