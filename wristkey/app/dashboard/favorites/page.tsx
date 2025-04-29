"use client";
import React, { useEffect, useState } from "react";
import WalletNav from "@/components/ui/WalletNav";
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
				<WalletNav currentTab="favorites" />
			<div className="mx-auto max-w-7xl p-6 w-[90%] pl-[20%]">
				<h1 className="text-4xl text-center p-2">Favorites</h1>
				<div>
					<p className="text-lg font-semibold">Trending NFTs:</p>
					{favoriteNFTs ? (
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{favoriteNFTs.map((nft, index) => (
								<li key={index}>
									<CoinCard
										name={nft.collection?.name ?? "N/A"}
										thumb={nft.collection?.bannerImageUrl}
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
						<p className="text-gray-500">No Trending NFTs</p>
					)}
				</div>
				<div className="trendingList space-y-6">
					<p className="text-lg font-semibold">Trending Coins:</p>
					{favoriteTokens ? (
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{favoriteTokens.map((token, index) => (
								<li key={index}>
									<CoinCard
										name={token.metadata.name ?? "N/A"}
										thumb={token.metadata.logo}
										address={token.token_addresses.address}
										//TODO: This can error has some tokens will not have a value defined for USD!!
										price={
											token.token_addresses.prices[0]
												? `${token.token_addresses.prices[0].value}${token.token_addresses.prices[0].currency}
                                    `
												: ""
										}
										identifier={"token"}
									/>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500">No Trending Tokens</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Favorites;
