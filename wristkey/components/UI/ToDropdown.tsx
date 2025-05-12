"use client";
import React, {
	useState,
	useEffect,
	useRef,
	useContext,
	createContext,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { Alchemy, Network } from "alchemy-sdk";
import { asset } from "@/app/dashboard/portfolio/api";

const settings = {
	apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
	network: Network.ETH_MAINNET,
};

let alchemy: Alchemy;

const to_asset: Map<string, asset> = new Map([
	[
		"Bitcoin",
		{
			balance: undefined,
			value: 24000,
			change: 15,
			percentage: "15%",
			address: "0x7c5d7B4b90892ce698ae17cDCED3a60aa505aF8F",
		},
	],
	[
		"USDT",
		{
			balance: undefined,
			value: 1,
			change: 0,
			percentage: "0%",
			address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
		},
	],
	[
		"ETH 2.0",
		{
			balance: undefined,
			value: 0,
			change: 2,
			percentage: "2%",
			address: "0xFbE6F37d3db3fc939F665cfe21238c11a5447831",
		},
	],
]);

type dropdownData = {
	toName: string | null;
	toAsset: asset | null;
	setToDropdown: (name: string, asset: asset) => void;
};

const ToDropdownContext = createContext<dropdownData | undefined>(undefined);

export const ToDropdownProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [assetName, setAssetName] = useState<string | null>(null);
	const [asset, setAsset] = useState<asset | null>(null);

	const update = (name: string, asset: asset) => {
		setAssetName(name);
		setAsset(asset);
	};

	return (
		<ToDropdownContext.Provider
			value={{ toName: assetName, toAsset: asset, setToDropdown: update }}
		>
			{children}
		</ToDropdownContext.Provider>
	);
};

export const useToDropdown = () => {
	const context = useContext(ToDropdownContext);
	if (!context)
		throw new Error(
			"useToDropdown must be used within a ToDropdownProvider"
		);
	return context;
};

const ToDropdown: React.FC = () => {
	const { toName, setToDropdown } = useToDropdown();
	const [dropdownProperties] = useState<Map<string, asset>>(to_asset);
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
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const handleItemClick = (name: string, asset: asset) => {
		setToDropdown(name, asset);
		setIsOpen(false);
	};

	return (
		<div className="relative dropdown">
			<button
				onClick={toggleDropdown}
				className="text-black hover:text-gray-400"
			>
				{toName ?? "(Select coin)"}
			</button>
			{isOpen && (
				<div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg z-10">
					<ul className="py-2">
						{Array.from(dropdownProperties.entries()).map(
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

export default ToDropdown;
