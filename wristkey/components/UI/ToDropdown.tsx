"use client"
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust the path as needed
import { useRouter } from "next/navigation";
import { Alchemy, Network } from "alchemy-sdk";
import { asset, get_wallet_data } from "@/app/dashboard/portfolio/api";
import { useWallets } from "@/app/dashboard/mining/managewallets/api";

const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
};

let alchemy : Alchemy;

interface DropdownProps 
{
    onSelect: (selectedName: string, selectedAsset: asset) => void;
}

const to_asset : Map<string, asset> = new Map();

/*
TODO: Look up these in the API
    These values need to be updated manually with the token api
*/

//BitCoin
to_asset.set("Bitcoin", 
    {
        balance: undefined,
        value: 24000,
        change: 15,
        percentage: "15%" ,
        address: "0x7c5d7B4b90892ce698ae17cDCED3a60aa505aF8F"
    });

//USDT
to_asset.set("USDT", 
    {
        balance: undefined,
        value: 1,
        change: 0,
        percentage: "0%",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    });

//ETH 2.0
to_asset.set("ETH 2.0", 
    {
        balance: undefined,
        value: 0,
        change: 2,
        percentage: "2%",
        address: "0xFbE6F37d3db3fc939F665cfe21238c11a5447831"
    });

const ToDropdown: React.FC<DropdownProps> = ({onSelect}) => {

    const {wallets, refreshWallets} = useWallets();
    const { user, logout } = useAuth();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false); // State to toggle the dropdown
    const [selectedCoin, setSelectedCoin] = useState<string | null>("(Select coin)");

	// Function to toggle the dropdown visibility
	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	// Close the dropdown if clicked outside of it
	const closeDropdown = () => {
		setIsOpen(false);
	};

	// Handling click outside the dropdown to close it
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			// If the click happened outside the dropdown, close it
			if (
				event.target instanceof HTMLElement &&
				!event.target.closest(".dropdown")
			) {
				setIsOpen(false);
			}
		};

        //TODO: When grabbing the hardcoded tokens, grab their market info here with
        //TokenFromContract 

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const handleItemClick = (name: string, asset : asset) => {
        //this is currently broken
		setSelectedCoin(name);   // Update button text
		setIsOpen(false);        // Close dropdown

        //This is resetting the prop, but we need it so we can access the token data
        onSelect(name, asset);
	};

	return (
		<div className="relative dropdown">
			<button
				onClick={toggleDropdown}
				className="text-black hover:text-gray-400"
			>
				{selectedCoin}
			</button>

			{/* Dropdown menu */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg z-10">
					<ul className="py-2">
                        {Array.from(to_asset.entries()).map(([name, asset]) => (
							<li key={name}>
								<span
									onClick={() => handleItemClick(name, asset)}
									className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
								>
									{name}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default ToDropdown;
