"use client";
import React, { useEffect, useState } from "react";
import WalletNav from "@/components/ui/WalletNav";
import WalletCard from "@/components/walletCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getWalletsFromUser, Wallet } from "@/lib/firestore";

const ManageWallets = () => {
	const { user } = useAuth();
	const router = useRouter();
	const [activeId, setActiveId] = useState<string | null>(null);
	const handleClick = (id: string) => {
		setActiveId(id);
	};
	const [wallets, setWallets] = useState<Wallet[]>([]);

	
	useEffect(() => {
		console.log("User in ManageWallets:", user);
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
				</div>
				<WalletNav currentTab="mining"/>

				<div className="ml-72 mt-8">
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
