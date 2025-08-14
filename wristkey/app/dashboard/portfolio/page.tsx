"use client";
import React, { useEffect, useState } from "react";
import {useWallets} from "@/app/dashboard/mining/managewallets/api";
import WalletNav from "@/components/UI/WalletNav";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Alchemy, Network } from "alchemy-sdk";
import { Token } from "../coins/api";
import { asset, get_wallet_data, sumUpAllTokens } from "./api";

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

    const[wallet_sum, updateWalletSum] = useState("$0.0");

    const{wallets, refreshWallets} = useWallets();

	const handleClick = (page: "mywallet" | "nfts") => {
		setActiveTab(page);
	};

	useEffect(() => {
		async function connectWallets() 
        {	
            let wallet_data = await get_wallet_data(user, alchemy, wallets);
			updateWalletData(wallet_data);
            if(wallet_data) updateWalletSum("$" + (sumUpAllTokens(wallet_data).toFixed(2) ?? "0.0"));
		}

		const alchemy = new Alchemy(settings);
		connectWallets();

    }, [wallets]);

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
					{wallet_sum}
				</h1>
				<h1 className="text-center text-3xl text-green-500">
					
				</h1>
			</div>
			<div className="bg-gray-100 rounded-t-3xl p-2">
				<WalletNav currentTab="portfolio"/>
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

export default Portfolio;