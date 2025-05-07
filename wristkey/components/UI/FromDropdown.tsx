"use client"
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust the path as needed
import { useRouter } from "next/navigation";
import { Alchemy, Network } from "alchemy-sdk";
import { asset, get_wallet_data } from "@/app/dashboard/portfolio/api";
import { useWallets } from "@/app/dashboard/mining/managewallets/api";

/*
    FromDropdown needs to use the user's tokens from their wallet
*/

const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
};

let alchemy : Alchemy;

interface DropdownProps 
{
    onSelect: (selectedName: string, selectedAsset: asset) => void;
}

const FromDropdown: React.FC<DropdownProps> = ({onSelect}) => {

    const {wallets, refreshWallets} = useWallets();
    const { user, logout } = useAuth();
    const router = useRouter();

    const[dropdownProperties, setdropdownProperties] = useState<Map<string, asset> | null>(null);
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

        //Sets the dropdown to only show the tokens the user has
        async function set_tokens()
        {
            let tokens = await get_wallet_data(user, alchemy, wallets);

            //Populate the assets we know the user has
            if(tokens)
            {
                setdropdownProperties(tokens);
            }
        }

        alchemy = new Alchemy(settings);

        set_tokens();

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [wallets]); //update when wallets is updated!!

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
                        {dropdownProperties && Array.from(dropdownProperties.entries()).map(([name, asset]) => (
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

export default FromDropdown;
