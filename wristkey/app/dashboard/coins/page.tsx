"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import * as network from "@/utils/network";
import * as API from "./api";
import CoinCard from "@/components/coinCard";
import WalletNav from "@/components/ui/WalletNav";
import { Alchemy, FloorPriceMarketplace, Network } from "alchemy-sdk";

let alchemy: Alchemy;

const settings = {
	apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
	network: Network.ETH_MAINNET,
};

export default function Coins() {
	const [networkid, setNetworkID] = useState<string | null>(null);
	const [trending_tokens, setTrendingTokens] = useState<API.Token[] | null>(
		null
	);
	const [trending_nfts, setTrendingNFTs] = useState<
		API.NFTCollection[] | null
	>(null);
	const [searchNFT, setSearchNFT] = useState<
		API.NFTCollection | undefined | null
	>(null);
	const [searchToken, setSearchToken] = useState<
		API.Token | undefined | null
	>(null);

	async function handleSearch(event: React.KeyboardEvent<HTMLInputElement>) {
		if (
			event.code == "Enter" &&
			event.currentTarget.id == "TokenNFTSearchBar"
		) {
			const alchemy = new Alchemy(settings);
			const input = (
				document.getElementById("TokenNFTSearchBar") as HTMLInputElement
			).value;
			const token = await API.TokenFromContract(alchemy, input);
			const collection = await API.NFTFromContract(alchemy, input);

			console.log(input);

			if (token) {
				setSearchToken(token);
			} else {
				setSearchToken(null);
			}

			if (collection) {
				setSearchNFT(collection);
			} else {
				setSearchNFT(null);
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

	useEffect(() => {
		const fetchNFTs = async () => {
			if (alchemy) {
				setTrendingNFTs(await API.getTrendingNFTList(alchemy, 5));
			}
		};

		fetchNFTs();
	}, [alchemy]);

	useEffect(() => {
		const fetchTokens = async () => {
			if (alchemy) {
				setTrendingTokens(await API.getTrendingTokenList(alchemy, 10));
			}
		};
		fetchTokens();
	}, [alchemy]);

	return (
		<div className="bg-gradient-to-r from-blue-700 to-blue-950">
			<div className="bg-gray-100 rounded-t-3xl flex h-screen">
				<div className="w-auto md:w-1/3 lg:w-1/5 2xl:w-1/5 flex place-content-center mt-20">
					<WalletNav currentTab="explore" />
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
					</div>

					<div>
						<div className="search-bar space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Search:
							</label>
							<input
								type="text"
								id="TokenNFTSearchBar"
								name="TokenNFTSearchBar"
								className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
								placeholder="Search by Contract Address..."
								style={{ color: "black" }}
								onKeyDown={(event) => handleSearch(event)}
							/>

							<div className="searchResult space-y-6">
								{searchToken ? (
									<CoinCard
										name={
											searchToken.metadata.name ?? "N/A"
										}
										thumb={searchToken.metadata.logo}
										address={
											searchToken.token_addresses.address
										}
										//TODO: This can error has some tokens will not have a value defined for USD!!
										price={
											searchToken.token_addresses
												.prices[0]
												? `${searchToken.token_addresses.prices[0].value}${searchToken.token_addresses.prices[0].currency}
                                    `
												: ""
										}
										identifier={"token"}
									/>
								) : (
									<p></p>
								)}
							</div>

							<div className="searchResult space-y-6">
								{searchNFT ? (
									<CoinCard
										name={
											searchNFT.collection?.name ?? "N/A"
										}
										thumb={
											searchNFT.collection?.bannerImageUrl
										}
										address={searchNFT.contract_address}
										price={`${
											(
												searchNFT.floor_pricing
													.openSea as FloorPriceMarketplace
											).floorPrice
										}${
											(
												searchNFT.floor_pricing
													.openSea as FloorPriceMarketplace
											).priceCurrency
										}`}
										identifier={"nft"}
									/>
								) : (
									<p></p>
								)}
							</div>
						</div>

						<div>
							<p className="text-lg font-semibold">
								Trending Coins:
							</p>
							{trending_tokens ? (
								<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{trending_tokens.map((token, index) => (
										<CoinCard
											key={token.token_addresses.address}
											name={token.metadata.name ?? "N/A"}
											thumb={token.metadata.logo}
											address={
												token.token_addresses.address
											}
											//TODO: This can error has some tokens will not have a value defined for USD!!
											price={
												token.token_addresses.prices[0]
													? `${token.token_addresses.prices[0].value}${token.token_addresses.prices[0].currency}
                                    `
													: ""
											}
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

						<div>
							<p className="text-lg font-semibold">
								Trending NFTs:
							</p>
							{trending_nfts ? (
								<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{trending_nfts.map((nft, index) => (
										<li key={index}>
											<CoinCard
												name={
													nft.collection?.name ??
													"N/A"
												}
												thumb={
													nft.collection
														?.bannerImageUrl
												}
												address={nft.contract_address}
												price={`${
													(
														nft.floor_pricing
															.openSea as FloorPriceMarketplace
													).floorPrice
												}${
													(
														nft.floor_pricing
															.openSea as FloorPriceMarketplace
													).priceCurrency
												}`}
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
	);
}
