"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as API from "../api";
import { Alchemy, Network } from "alchemy-sdk";
import { useAuth } from "@/context/AuthContext";
import {
	addFavoriteToUser,
	getFavoritesForUser,
	removeFavoriteFromUser,
} from "@/lib/firestore";

const settings = {
	apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
	network: Network.ETH_MAINNET,
};

export default function AssetInfo() {
	const [nft, setNft] = useState<API.NFTCollection | undefined | null>(null);
	const [token, setToken] = useState<API.Token | undefined | null>(null);
	const [assetDescription, setAssetDescription] = useState<
		string | undefined | null
	>(null);
	const [assetAddress, setAssetAddress] = useState<string | undefined | null>(
		null
	);
	const [favorited, setFavorited] = useState<boolean>(false);

	const { user } = useAuth();
	const type = useSearchParams().get("type");
	const address = useSearchParams().get("address");

	const favoriteAsset = async () => {
		if (user && assetAddress && type) {
			const prevState = favorited;
			setFavorited(!prevState);
			const favorites = await getFavoritesForUser(user);
			if (!favorites.map((f) => f.address).includes(assetAddress)) {
				addFavoriteToUser(user, assetAddress, type);
			} else {
				removeFavoriteFromUser(user, assetAddress);
			}
		}
	};

	useEffect(() => {
		const fetchAsset = async (
			address: string | null,
			type: string | null
		) => {
			if (address && user && type) {
				let asset: API.NFTCollection | API.Token | undefined;
				if (type == "nft") {
					try {
						asset = await API.NFTFromContract(alchemy, address);
						setNft(asset);
						setAssetAddress(asset?.contract_address);
					} catch (e) {}
				} else if (type == "token") {
					try {
						asset = await API.TokenFromContract(alchemy, address);
						setToken(asset);
						setAssetAddress(asset?.token_addresses.address);
					} catch (e) {}
				}
				const favorites = await getFavoritesForUser(user);
				if (favorites.map((f) => f.address).includes(address)) {
					setFavorited(true);
				}
			} else {
				setToken(null);
				setNft(null);
			}
		};

		const alchemy = new Alchemy(settings);
		fetchAsset(address, type);
	}, [user, address, type]);

	return (
		<div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-700 to-blue-950">
			<div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
				<div className="p-6 text-center">
					<div className="mb-4">
						{!nft && !token && (
							<div>
								<p className="text-gray-500">No Asset</p>
							</div>
						)}

						{nft && (
							<div>
								<p className="text-xl font-semibold text-gray-800">
									{nft.nfts[0].collection?.name}
								</p>
								<div className="mt-4">
									<img
										src={
											nft.nfts[0].collection
												?.bannerImageUrl as "image"
										}
										alt={`${nft.nfts[0].collection?.name} Image`}
										className="mx-auto rounded-md"
									/>
								</div>
							</div>
						)}

						{token && (
							<div>
								<p className="text-xl font-semibold text-gray-800">
									{token.metadata.name}
								</p>
								<div className="mt-4">
									<img
										src={token.metadata.logo as "image"}
										alt={`${token.metadata.name} Image`}
										className="mx-auto rounded-md"
									/>
								</div>
							</div>
						)}
					</div>

					<button
						onClick={favoriteAsset}
						className={`w-10 h-10 flex justify-center items-center rounded-full shadow transition ${
							favorited
								? "bg-red-500 text-white hover:bg-red-600"
								: "bg-gray-300 text-gray-700 hover:bg-gray-400"
						}`}
						aria-label="Favorite"
					>
						{favorited ? "♥" : "♡"}
					</button>

					<div className="mt-6">
						{!assetDescription && (
							<p className="text-gray-500">No Description</p>
						)}

						{assetDescription && (
							<div>
								<p className="text-gray-700">
									{assetDescription}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
