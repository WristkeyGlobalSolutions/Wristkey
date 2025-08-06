"use client";
import React, {
	useState,
	useEffect,
	useContext,
	useRef,
	createContext,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { Alchemy, Network } from "alchemy-sdk";
import { asset, get_wallet_data_cheap } from "@/app/dashboard/portfolio/api";
import { useWallets } from "@/app/dashboard/mining/managewallets/api";

const settings = {
	apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
	network: Network.ETH_MAINNET,
};

let alchemy: Alchemy;

type dropdownData = {
	fromName: string | null;
	fromAsset: asset | null;
	setFromDropdown: (name: string, asset: asset) => void;
};

const FromDropdownContext = createContext<dropdownData | undefined>(undefined);

export const FromDropdownProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [assetName, setAssetName] = useState<string | null>(null);
	const [asset, setAsset] = useState<asset | null>(null);

	const update = (name: string, asset: asset) => {
		setAssetName(name);
		setAsset(asset);
	};

	return (
		<FromDropdownContext.Provider
			value={{
				fromName: assetName,
				fromAsset: asset,
				setFromDropdown: update,
			}}
		>
			{children}
		</FromDropdownContext.Provider>
	);
};

export const useFromDropdown = () => {
	const context = useContext(FromDropdownContext);
	if (!context)
		throw new Error(
			"useFromDropdown must be used within a FromDropdownProvider"
		);
	return context;
};

const FromDropdown: React.FC = () => {
	const { wallets } = useWallets();
	const { user } = useAuth();
	const { fromName, setFromDropdown } = useFromDropdown();

	const [dropdownProperties, setDropdownProperties] = useState<Map<
		string,
		asset
	> | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => setIsOpen(!isOpen);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				event.target instanceof HTMLElement &&
				!event.target.closest(".dropdown")
			) {
				setIsOpen(false);
			}
		};

		async function set_tokens() {
			let tokens = await get_wallet_data_cheap(user, alchemy, wallets);
			if (tokens) setDropdownProperties(tokens);
		}

		alchemy = new Alchemy(settings);
		set_tokens();

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [wallets]);

	const handleItemClick = (name: string, asset: asset) => {
		setFromDropdown(name, asset);
		setIsOpen(false);
	};

	return (
		<div className="relative dropdown">
			<button
				onClick={toggleDropdown}
				className="text-black hover:text-gray-400"
			>
				{fromName ?? "(Select coin)"}
			</button>
			{isOpen && (
				<div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg z-10">
					<ul className="py-2">
						{dropdownProperties &&
							Array.from(dropdownProperties.entries()).map(
								([name, asset]) => (
									<li key={name}>
										<span
											onClick={() =>
												handleItemClick(name, asset)
											}
											className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
										>
											{name}
										</span>
									</li>
								)
							)}
					</ul>
				</div>
			)}
		</div>
	);
};

export default FromDropdown;
