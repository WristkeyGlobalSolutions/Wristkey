"use client";
import React, { useEffect, useState } from "react";
import {
	getContract,
	connectWalletViaExtention,
	getWallets,
	ALCgetTokens,
} from "./api";
import WalletNav from "@/components/UI/WalletNav";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Alchemy, Network } from "alchemy-sdk";
import { Token } from "../coins/api";

const settings = {
	apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
	network: Network.ETH_MAINNET,
};

const Portfolio = () => {
	const [activeTab, setActiveTab] = useState<"mywallet" | "nfts">("mywallet");
	const { user, refreshUser } = useAuth();
	const [wallet_data, updateWalletData] = useState<Map<string, asset> | null>(
		null
	);

	const handleClick = (page: "mywallet" | "nfts") => {
		setActiveTab(page);
	};

	type asset = {
		balance: string | undefined;
		value: number;
		change: number;
		percentage: string;
	};

	useEffect(() => {
		async function connectWallets() {
			if (user) {
				let wallets = await getWallets(user);
				let wallet_data: Map<string, [Token, string][]> = new Map();
				let token_data: Map<Token, string> = new Map();

				const assetMap = new Map<string, asset>();

				if (wallets) {
					for (let i = 0; i < wallets.length; i++) {
						let tokens = await ALCgetTokens(alchemy, wallets[i]);
						wallet_data.set(wallets[i], tokens);

						//Get the total for this token's amount
						tokens.forEach((data: [Token, string]) => {
							if (token_data.has(data[0])) {
								token_data.set(
									data[0],
									`${
										parseFloat(
											token_data.get(data[0]) as string
										) + parseFloat(data[1] as string)
									}`
								);
							} else {
								token_data.set(data[0], data[1]);
							}
						});

						console.log(token_data);
					}
				}

				let keys = token_data.keys().toArray();
				for (let i = 0; i < token_data.size; i++) {
					assetMap.set(keys[i].metadata.name ?? "N/A", {
						balance: token_data.get(keys[i]),
						value:
							parseFloat(
								keys[i].token_addresses.prices[0]?.value
							) * parseFloat(token_data.get(keys[i]) ?? "0"),
						change: 0,
						percentage: "0%",
					});
				}

				console.log(assetMap);

				updateWalletData(assetMap);
			}
		}

		const alchemy = new Alchemy(settings);
		connectWallets();
	}, [user]);

	const router = useRouter();

	function shortStringWallet(address: string) {
		return (
			address.slice(0, 4) +
			"..." +
			address.slice(address.length - 4, address.length)
		);
	}

	return (
		<div className="bg-gradient-to-r from-blue-700 to-blue-950">
			{/* Header */}
			<div className="transparent p-8">
				<h1 className="text-white text-center font-bold text-7xl">
					$210,101
				</h1>
				<h1 className="text-center text-3xl text-green-500">
					+2.5%
				</h1>
			</div>
			<div className="bg-gray-100 rounded-t-3xl p-2">
				<WalletNav />
				<div className="connectWalletButton text-center">
					{
						<button
						 onClick={() => router.push(`/dashboard/portfolio/wallet_connect`)}
						 className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
						>
							Connect Wallet
						</button>
					}
				</div>

				{/* White section content with a table below the buttons */}
				<div className="transparent flex min-h-screen p-2 ml-60">
					{/* Wallet  Choices */}
					<div className="flex-1 px-6 overflow-x-auto">
						<div className="flex justify-center">
							<button
							 className={`w-full py-2 text-center text-xl rounded-tl-xl hover:bg-gray-300 ${activeTab === 'mywallet' ? 'bg-gray-300' : ''}`}
							 onClick={() => handleClick("mywallet")}
							>
								My Wallet
							</button>
							<button
							 className={`w-full py-2 text-center text-xl rounded-tr-xl hover:bg-gray-300 ${activeTab === 'nfts' ? 'bg-gray-300' : ''}`}
							 onClick={() => handleClick("nfts")}
							>
								NFT Collection
							</button>
						</div>

						<div>
							{/* Table Section for My Coins */}
							{activeTab === "mywallet" ? (
								<table className="min-w-full border-collapse">
									<thead>
										<tr className="bg-gray-300">
											<th className="py-2 px-4 border-b text-left">
												Asset
											</th>
											<th className="py-2 px-4 border-b text-right">
												Balance
											</th>
											<th className="py-2 px-4 border-b text-right">
												Value
											</th>
											<th className="py-2 px-4 border-b text-right">
												Change
											</th>
											<th className="py-2 px-4 border-b text-right">
												Percentage
											</th>
										</tr>
									</thead>
									<tbody>
										{wallet_data && [...wallet_data.entries()].map(
											([asset, data], index) => (
												<tr key={index}>
													<td className="py-2 px-4 border-b">
														{asset}
													</td>
													<td className="py-2 px-4 border-b text-right">
														{data.balance}
													</td>
													<td className="py-2 px-4 border-b text-right">
														${data.value.toFixed(2)}
													</td>
													<td className="py-2 px-4 border-b text-right">
														{data.change}
													</td>
													<td className="py-2 px-4 border-b text-right">
														{data.percentage}
													</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							) : (
								<table className="min-w-full border-collapse">
									<thead>
										<tr className="bg-gray-300">
											<th className="py-2 px-4 border-b text-left">
												Asset
											</th>
											<th className="py-2 px-4 border-b text-right">
												Balance
											</th>
											<th className="py-2 px-4 border-b text-right">
												Value
											</th>
											<th className="py-2 px-4 border-b text-right">
												Change
											</th>
											<th className="py-2 px-4 border-b text-right">
												Percentage
											</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="py-2 px-4 border-b">
												Bitcoin
											</td>
											<td className="py-2 px-4 border-b text-right">
												0.0
											</td>
											<td className="py-2 px-4 border-b text-right">
												0%
											</td>
											<td className="py-2 px-4 border-b text-right">
												$18.00
											</td>
											<td className="py-2 px-4 border-b text-right">
												0
											</td>
										</tr>
										<tr>
											<td className="py-2 px-4 border-b">
												Ethereum
											</td>
											<td className="py-2 px-4 border-b text-right">
												0.0
											</td>
											<td className="py-2 px-4 border-b text-right">
												0%
											</td>
											<td className="py-2 px-4 border-b text-right">
												$20.00
											</td>
											<td className="py-2 px-4 border-b text-right">
												0
											</td>
										</tr>
										<tr>
											<td className="py-2 px-4 border-b">
												USDT
											</td>
											<td className="py-2 px-4 border-b text-right">
												0.0
											</td>
											<td className="py-2 px-4 border-b text-right">
												0%
											</td>
											<td className="py-2 px-4 border-b text-right">
												$5.00
											</td>
											<td className="py-2 px-4 border-b text-right">
												0
											</td>
										</tr>
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
<tr>
                        <td className="py-2 px-4 border-b">Bitcoin</td>
                        <td className="py-2 px-4 border-b text-right">0.0</td>
                        <td className="py-2 px-4 border-b text-right">0%</td>
                        <td className="py-2 px-4 border-b text-right">$18.00</td>
                        <td className="py-2 px-4 border-b text-right">0</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">Ethereum</td>
                        <td className="py-2 px-4 border-b text-right">0.0</td>
                        <td className="py-2 px-4 border-b text-right">0%</td>
                        <td className="py-2 px-4 border-b text-right">$20.00</td>
                        <td className="py-2 px-4 border-b text-right">0</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">USDT</td>
                        <td className="py-2 px-4 border-b text-right">0.0</td>
                        <td className="py-2 px-4 border-b text-right">0%</td>
                        <td className="py-2 px-4 border-b text-right">$5.00</td>
                        <td className="py-2 px-4 border-b text-right">0</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">Avax</td>
                        <td className="py-2 px-4 border-b text-right">0.0</td>
                        <td className="py-2 px-4 border-b text-right">0%</td>
                        <td className="py-2 px-4 border-b text-right">$5.00</td>
                        <td className="py-2 px-4 border-b text-right">0</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">Aptos</td>
                        <td className="py-2 px-4 border-b text-right">0.0</td>
                        <td className="py-2 px-4 border-b text-right">0%</td>
                        <td className="py-2 px-4 border-b text-right">$5.00</td>
                        <td className="py-2 px-4 border-b text-right">0</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">Agoric</td>
                        <td className="py-2 px-4 border-b text-right">0.0</td>
                        <td className="py-2 px-4 border-b text-right">0%</td>
                        <td className="py-2 px-4 border-b text-right">$5.00</td>
                        <td className="py-2 px-4 border-b text-right">0</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">Filecoin</td>
                        <td className="py-2 px-4 border-b text-right">0.0</td>
                        <td className="py-2 px-4 border-b text-right">0%</td>
                        <td className="py-2 px-4 border-b text-right">$5.00</td>
                        <td className="py-2 px-4 border-b text-right">0</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">BNB</td>
                        <td className="py-2 px-4 border-b text-right">0.0</td>
                        <td className="py-2 px-4 border-b text-right">0%</td>
                        <td className="py-2 px-4 border-b text-right">$5.00</td>
                        <td className="py-2 px-4 border-b text-right">0</td>
                    </tr>
 */

export default Portfolio;
