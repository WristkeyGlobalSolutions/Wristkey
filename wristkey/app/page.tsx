"use client";
import React, { OptionHTMLAttributes, useState } from "react";
import Link from "next/link";
import {
	connectContract,
	connectWallet,
	connectNetwork,
	createWallet,
	getWallets,
	getBalance,
} from "@/utils/wallet";

export default function Home() {
	const [wallets, setWallets] = useState<string[] | null>(null);
	const [wallet, setWallet] = useState<string | null | -1>(null);
	const [contract, setContract] = useState<string | null | -1 | -2 | -3>(
		null
	);
	const [networkid, setNetworkID] = useState<string | null>(null);
	const [new_wallet, setNewWallet] = useState<string | null | -1>(null);

	async function handleNetworkConnect() {
		return setNetworkID(await connectNetwork());
	}

	//Handles connecting to wallet inside of util
	async function handleWalletConnect() {
		let ret = setWallet(await connectWallet());
		setWallets(await getWallets());
		return ret;
	}

	async function handleWalletCreate() {
		let ret = setNewWallet(await createWallet());
		setWallets(await getWallets());
		return ret;
	}

	async function handleContractConnect() {
		const ContractAddress = (
			document.getElementById("ContractAddress") as HTMLInputElement
		).value;
		return setContract(await connectContract(ContractAddress));
	}

	return (
		<div className="main">
			<div className="connectToNetworkButton">
				{networkid ? (
					<button
						onClick={handleNetworkConnect}
						className="bg-green-500 text-white px-4 py-2 rounded"
					>
						Network ID: {networkid}
					</button>
				) : (
					<button
						onClick={handleNetworkConnect}
						className="bg-blue-500 text-white px-4 py-2 rounded"
					>
						Connect to Network
					</button>
				)}
			</div>

			<br></br>

			<div className="Contract Address">
				<label>Contract Address:</label>
				<input
					type="text"
					id="ContractAddress"
					name="ContractAddress"
					style={{ color: "#000000" }}
				></input>
			</div>

			<br></br>

			<div className="connectSmartContractButton">
				{!contract && (
					<button
						onClick={handleContractConnect}
						className="bg-blue-500 text-white px-4 py-2 rounded"
					>
						Connect Contract
					</button>
				)}

				{contract === -1 && (
					<button
						onClick={handleContractConnect}
						className="bg-red-500 text-white px-4 py-2 rounded"
					>
						No RPC Provider
					</button>
				)}

				{contract === -2 && (
					<button
						onClick={handleContractConnect}
						className="bg-red-500 text-white px-4 py-2 rounded"
					>
						Failed to fetch ABI
					</button>
				)}

				{contract === -3 && (
					<button
						onClick={handleContractConnect}
						className="bg-red-500 text-white px-4 py-2 rounded"
					>
						No Contract Address provided
					</button>
				)}

				{typeof contract === "string" && (
					<button
						onClick={handleContractConnect}
						className="bg-green-500 text-white px-4 py-2 rounded"
					>
						Contract Address: {contract}
					</button>
				)}
			</div>

			<br></br>

			<div className="connectWalletButton">
				{!wallet && (
					<button
						onClick={handleWalletConnect}
						className="bg-blue-500 text-white px-4 py-2 rounded"
					>
						Connect Wallet
					</button>
				)}

				{wallet === -1 && (
					<button
						onClick={handleWalletConnect}
						className="bg-red-500 text-white px-4 py-2 rounded"
					>
						No RPC Provider
					</button>
				)}

				{typeof wallet === "string" && (
					<button
						onClick={handleWalletConnect}
						className="bg-green-500 text-white px-4 py-2 rounded"
					>
						Status: Connected
					</button>
				)}
			</div>

			<br></br>

			<div className="createWalletButton">
				{!new_wallet && (
					<button
						onClick={handleWalletCreate}
						className="bg-blue-500 text-white px-4 py-2 rounded"
					>
						Create Wallet
					</button>
				)}

				{new_wallet === -1 && (
					<button
						onClick={handleWalletCreate}
						className="bg-red-500 text-white px-4 py-2 rounded"
					>
						No RPC Provider
					</button>
				)}

				{typeof new_wallet === "string" && (
					<button
						onClick={handleWalletCreate}
						className="bg-green-500 text-white px-4 py-2 rounded"
					>
						Made: {new_wallet}
					</button>
				)}
			</div>

			<br></br>

			<div className="walletList">
				{wallets ? (
					<ul>
						{wallets.map((wallet_address, index) => (
							<li key={index}>{wallet_address}</li>
						))}
					</ul>
				) : (
					<p>No Wallets</p>
				)}
			</div>

			<div className="directory">
				<Link href="/staking" className="text-blue-600 underline mr-4">
					Staking
				</Link>
				<Link href="/security" className="text-red-600 underline mr-4">
					Security
				</Link>
				<Link href="/auth" className="text-green-600 underline mr-4">
					login
				</Link>
				<Link href="/auth" className="text-yellow-600 underline">
					register
				</Link>
			</div>
		</div>
	);
}
