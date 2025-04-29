"use client";
import React, { useEffect, useState } from "react";
import WalletNav from "@/components/UI/WalletNav";
import WalletCard from "@/components/walletCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getWalletsFromUser, Wallet } from "@/lib/firestore";
import { PlusIcon } from '@heroicons/react/24/solid';
import * as wallet from "./api";
import { connectNetwork } from "@/utils/network";

const ManageWallets = () => {
	const { user } = useAuth();
	const router = useRouter();
	const [activeId, setActiveId] = useState<string | null>(null);
	const [newWalletAddress, setNewWalletAddress] = useState<string | null>(null);
	const [showPopup, setShowPopup] = useState(false);
	const [wallets, setWallets] = useState<Wallet[]>([]);

	const handleClick = (id: string) => {
		setActiveId(id);
	};
	
	//Handles connecting to wallet inside of util
	async function handleWalletConnectViaExtention() {
		try {
			if (!user) return;
			const new_wallet_address = await wallet.connectWalletViaExtention(
				user
			);
			if (!new_wallet_address) return;
			setNewWalletAddress(new_wallet_address);
			setShowPopup(false);
			window.location.reload();
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
		console.log("User in ManageWallets:", user);
		connectNetwork();
		if (!user) return;
		const fetchWallets = async () => {
			try {
				const response = await getWalletsFromUser(user); // Adjust the API endpoint as needed
				console.log("Fetched wallets:", response);
				setWallets(response); // Assuming the API returns an array of wallet addresses
			} catch (error) {
				console.error("Error fetching wallets:", error);
			}
		};
		fetchWallets();
	}, [user]);

	if (!user) {
		return <div>Please log in to view your wallets.</div>;
	}
	
	return (
		<div className="bg-gradient-to-r from-blue-700 to-blue-950">
			<div className="bg-gray-100 min-h-screen rounded-t-3xl p-2">
				<div className="relative flex items-center justify-center py-2">
					<button
						onClick={() => router.push("/dashboard/mining")}
						className="absolute left-72 text-2xl"
					>
						Back
					</button>
					<h1 className="text-4xl">Manage Wallets</h1>
					<button 
					 onClick={() => setShowPopup(true)}
					 className="absolute right-96 w-12 h-12 mt-4 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600"
					>
      					<PlusIcon className="w-6 h-6" />
    				</button>
					{/* Popup Box */}
					{showPopup && (
        				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          					<div className="bg-white p-6 rounded shadow-md w-fit">
            					<h2 className="text-lg text-center font-semibold mb-4">Connect Your Wallet</h2>
            					<input
             					 type="text"
             					 id="InputBar"
             					 name="InputBar"
             					 className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
             					 placeholder="Input phrase or address..."
             					 style={{ color: "black" }}
             					 onKeyDown={(event) => handleInput(event)}
            					/>
            					<div className="space-y-2">
									<button
                 					 onClick={handleWalletConnectViaExtention}
                 					 className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            						>
                						Connect Wallet Via Web-Extension
              						</button>
			  						<button
                 					 onClick={() => setShowPopup(false)}
                 					 className="w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            						>
                						Cancel
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
      				)}
				</div>

				<WalletNav currentTab="mining"/>
				<div className="ml-72 mt-8 w-5/6">
					<h1 className="text-black text-xl">My Wallets:</h1>
					{wallets.map((wallet) => (
						<div
							key={wallet.address}
							className="bg-white p-4 w-2/3 mt-4 border rounded-2xl shadow hover:shadow-lg"
							onClick={() => handleClick(wallet.address)}
						>
							<WalletCard
								wallet={wallet}
								active={activeId === wallet.address}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	); // end return
};

export default ManageWallets;
