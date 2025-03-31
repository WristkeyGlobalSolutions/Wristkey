"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { connectContract, connectWalletViaExtention } from "@/utils/wallet";
import * as network from "@/utils/network";
import CoinCard from "@/components/coinCard";

export default function Coins() {
	const [wallet, setWallet] = useState<string | null | -1>(null);
	const [contract, setContract] = useState<string | null | -1 | -2 | -3>(
		null
	);
	const [networkid, setNetworkID] = useState<string | null>(null);
	const [trending_tokens, setTrendingTokens] = useState<
		network.TrendingTokenObject[] | null
	>(null);
	const [trending_nfts, setTrendingNFTs] = useState<
		network.TrendingNFTObject[] | null
	>(null);

	//Handles connecting to wallet inside of util
	async function handleWalletConnect() {
		const ret = setWallet(await connectWalletViaExtention());
		return ret;
	}

	async function handleContractConnect() {
		const ContractAddress = (
			document.getElementById("ContractAddress") as HTMLInputElement
		).value;
		return setContract(await connectContract(ContractAddress));
	}

	//Anything updated on startup should go here
	useEffect(() => {
		const fetchTokens = async () => {
			setTrendingTokens(await network.getTrendingTokens());
		};

		const fetchNFTs = async () => {
			const nfts: network.TrendingNFTObject[] =
				await network.getTrendingNFTs();
			setTrendingNFTs(nfts);
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

				<div className="contract-address space-y-2">
					<label className="block text-sm font-medium text-gray-700">
						Contract Address:
					</label>
					<input
						type="text"
						id="ContractAddress"
						name="ContractAddress"
						className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div className="connectSmartContractButton text-center">
					{!contract && (
						<button
							onClick={handleContractConnect}
							className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
						>
							Connect Contract
						</button>
					)}

					{contract === -1 && (
						<button
							onClick={handleContractConnect}
							className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600"
						>
							No RPC Provider
						</button>
					)}

					{contract === -2 && (
						<button
							onClick={handleContractConnect}
							className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600"
						>
							Failed to fetch ABI
						</button>
					)}

					{contract === -3 && (
						<button
							onClick={handleContractConnect}
							className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600"
						>
							No Contract Address provided
						</button>
					)}

					{typeof contract === "string" && (
						<button
							onClick={handleContractConnect}
							className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600"
						>
							Contract Address: {contract}
						</button>
					)}
				</div>

				<div className="connectWalletButton text-center">
					{!wallet && (
						<button
							onClick={handleWalletConnect}
							className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
						>
							Connect Wallet Via Web-Extension
						</button>
					)}

					{wallet === -1 && (
						<button
							onClick={handleWalletConnect}
							className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600"
						>
							No RPC Provider
						</button>
					)}

					{typeof wallet === "string" && (
						<button
							onClick={handleWalletConnect}
							className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600"
						>
							Status: Connected
						</button>
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
										price_btc={token.price_btc + " BTC"}
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
										thumb={nft.thumb}
										price_btc={`${nft.native_currency_symbol} ${nft.floor_price_in_native_currency}`}
										volume={`${nft.native_currency_symbol} ${nft.data.h24_volume}`}
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
