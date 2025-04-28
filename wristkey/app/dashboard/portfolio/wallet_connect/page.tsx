"use client";
import React, { useEffect, useState } from "react";
import * as wallet from "../api";
import { useRouter } from "next/navigation";
import { connectNetwork } from "@/utils/network";
import { useAuth } from "@/context/AuthContext";

const WalletConnect = () => {
	const { user } = useAuth();
	const [newWalletAddress, setNewWalletAddress] = useState<string | null>(null);

	//Handles connecting to wallet inside of util
	async function handleWalletConnectViaExtention() {
		try {
			if (!user) return;
			const new_wallet_address = await wallet.connectWalletViaExtention(
				user
			);
			if (!new_wallet_address) return;
			setNewWalletAddress(new_wallet_address);
		} catch (error) {
			console.error("Error connecting wallet via extension:", error);
		}
	}

	async function handleInput(event: React.KeyboardEvent<HTMLInputElement>) {
		if (
			event.code == "Enter" &&
			event.currentTarget.id == "InputBar" &&
			user
		) {
			const input = (
				document.getElementById("InputBar") as HTMLInputElement
			).value;
			const _test = input;
			//This is a seeded phrase
			if (_test.trim().split(/\s+/).length === 12) {
				wallet.connectWalletViaPhrase(user, input);
			}
			//This is an address
			else {
				wallet.connectWalletViaAddress(user, input);
			}
		}
	}

	useEffect(() => {
		connectNetwork();
	}, [user]);

	const router = useRouter();

	return (
		<div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-700 to-blue-950 pb-[10vh]">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
				<h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
					Connect Your Wallet
				</h2>
				<div className="space-y-4">
					<div>
						<input
							type="text"
							id="InputBar"
							name="InputBar"
							className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
							placeholder="Input phrase or address..."
							style={{ color: "black" }}
							onKeyDown={(event) => handleInput(event)}
						/>
					</div>
					<button
						onClick={handleWalletConnectViaExtention}
						className="w-full bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
					>
						Connect Wallet Via Web-Extension
					</button>
					<button
						className="w-full bg-gray-100 text-gray-800 px-6 py-2 rounded-md shadow hover:bg-gray-200"
						onClick={() => router.push(`/dashboard/portfolio`)}
					>
						Return
					</button>
				</div>
				{newWalletAddress && (
					<div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
						<p className="text-center">
							Connected Wallet Address: <strong>{newWalletAddress}</strong>
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default WalletConnect;
