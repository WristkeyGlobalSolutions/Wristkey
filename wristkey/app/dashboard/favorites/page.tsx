"use client";
import React, { useEffect, useState } from "react";
import WalletNav from "@/components/UI/WalletNav";
import { useAuth } from "@/context/AuthContext";
import { Favorite, getFavoritesForUser } from "@/lib/firestore";
import * as API from "@/app/dashboard/coins/api";
import CoinCard from "@/components/coinCard";
import { Alchemy, FloorPriceMarketplace, Network } from "alchemy-sdk";

const settings = {
	apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
	network: Network.ETH_MAINNET,
};

const Favorites = () => {
	const { user } = useAuth();
	const [favorites, setFavorites] = useState<Favorite[]>([]);
	const [favoriteNFTs, setFavoriteNFTs] = useState<API.NFTCollection[]>([]);
	const [favoriteTokens, setFavoriteTokens] = useState<API.Token[]>([]);
	const [activeTab, setActiveTab] = useState<"tokens" | "nfts">("tokens");

	const handleClick = (page: "tokens" | "nfts") => {
		setActiveTab(page);
	};

	useEffect(() => {
		if (!user) return;
		const fetchFavorites = async () => {
			const favorites = await getFavoritesForUser(user);
			setFavorites(favorites);
		};
		fetchFavorites();
	}, [user]);

	useEffect(() => {
		if (favorites.length > 0) {
			const fetchNFTs = async () => {
				const alchemy = new Alchemy(settings);
				const nfts: API.NFTCollection[] = [];
				const tokens: API.Token[] = [];

				for (const favorite of favorites) {
					if (favorite.type == "nft") {
						const nft = await API.NFTFromContract(
							alchemy,
							favorite.address
						);
						if (nft) {
							nfts.push(nft);
						}
					} else if (favorite.type == "token") {
						const token = await API.TokenFromContract(
							alchemy,
							favorite.address
						);
						if (token) {
							tokens.push(token);
						}
					}
				}
				setFavoriteTokens(tokens);
				setFavoriteNFTs(nfts);
			};
			fetchNFTs();
		}
	}, [favorites]);

	return (
		<div className="bg-gradient-to-r from-blue-700 to-blue-950 h-screen">
			<div className="bg-gray-100 rounded-t-3xl h-screen">
			<WalletNav currentTab="favorites" />
			<div className="mx-auto max-w-7xl p-6 w-[90%] pl-[20%]">
				<h1 className="text-4xl text-center p-2">Favorites</h1>
				<div className="flex justify-center mt-4 mb-4">
					<button
					 className={`w-full py-2 text-center text-xl rounded-tl-xl hover:bg-gray-300 ${activeTab === 'tokens' ? 'bg-gray-300' : ''}`}
					 onClick={() => handleClick("tokens")}
					>
						Tokens
					</button>
					<button
					 className={`w-full py-2 text-center text-xl rounded-tr-xl hover:bg-gray-300 ${activeTab === 'nfts' ? 'bg-gray-300' : ''}`}
					 onClick={() => handleClick("nfts")}
					>
						NFTs
					</button>
				</div>
				{activeTab === "nfts" ? (
				<div>
					{favoriteNFTs ? (
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{favoriteNFTs.map((nft, index) => (
								<li key={index}>
									<CoinCard
                                        key={nft.contract_address}
										name={nft.collection?.name ?? "N/A"}
										thumb={nft.collection?.bannerImageUrl}
										address={nft.contract_address}
										identifier={"nft"}
									/>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500">No Favorite NFTs</p>
					)}
				</div>
				):(
				<div className="trendingList space-y-6">
					{favoriteTokens ? (
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{favoriteTokens.map((token, index) => (
								<li key={index}>
									<CoinCard
                                        key={token.contract_address}
										name={token.metadata.name ?? "N/A"}
										thumb={token.metadata.logo}
										identifier={"token"}
									/>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500">No Favorite Tokens</p>
					)}
				</div>
				)}
			</div>
			</div>
		</div>
	);
};

export default Favorites;
