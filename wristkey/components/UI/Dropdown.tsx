import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust the path as needed
import { useRouter } from "next/navigation";

const Dropdown: React.FC = () => {
	const { user, logout } = useAuth();
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false); // State to toggle the dropdown
	const [selectedCoin, setSelectedCoin] = useState("Coin");

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

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const handleItemClick = (name: string) => {
		setSelectedCoin(name);   // Update button text
		setIsOpen(false);        // Close dropdown
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
						{["Bitcoin", "Ethereum", "Solana", "Dogecoin", "Avax"].map((coin) => (
							<li key={coin}>
								<span
									onClick={() => handleItemClick(coin)}
									className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
								>
									{coin}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Dropdown;
