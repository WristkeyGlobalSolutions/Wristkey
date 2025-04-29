"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const WalletNav: React.FC<{ currentTab: "portfolio" | "explore" | "swap" | "favorites" | "mining" }> = ({ currentTab }) => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<
		"portfolio" | "explore" | "swap" | "favorites" | "mining"
	>(currentTab);
	const [isNavVisible, setIsNavVisible] = useState(true);

	const handleClick = (
		page: "portfolio" | "explore" | "swap" | "favorites" | "mining"
	) => {
		setActiveTab(page);
	};

	return (
		<div className="relative h-fit">
			{/* <div className="absolute top-4 left-4 z-50">
				<button
					onClick={() => setIsNavVisible(!isNavVisible)}
					className="bg-blue-500 text-white p-3 rounded-full shadow-lg focus:outline-none hover:bg-blue-600 transition duration-200"
				>
					<MenuSquareIcon size={24} />
				</button>
			</div> */}
			{isNavVisible && (
				<div className="fixed top-[25vh] left-0 w-64 h-fit bg-white shadow-lg rounded-r-lg z-40 flex flex-col p-4">
					<ul className="space-y-2">
						<li>
							<button
								onClick={() => [
									router.push("/dashboard/portfolio"),
									handleClick("portfolio"),
								]}
								className={`w-full text-left text-lg py-3 px-4 rounded-lg transition duration-200 ${
									activeTab === "portfolio"
										? "bg-blue-500 text-white"
										: "hover:bg-gray-100 text-gray-800"
								}`}
							>
								Portfolio
							</button>
						</li>
						<li>
							<button
								onClick={() => [
									router.push("/dashboard/coins"),
									handleClick("explore"),
								]}
								className={`w-full text-left text-lg py-3 px-4 rounded-lg transition duration-200 ${
									activeTab === "explore"
										? "bg-blue-500 text-white"
										: "hover:bg-gray-100 text-gray-800"
								}`}
							>
								Explore
							</button>
						</li>
						<li>
							<button
								onClick={() => [
									router.push("/dashboard/swap"),
									handleClick("swap"),
								]}
								className={`w-full text-left text-lg py-3 px-4 rounded-lg transition duration-200 ${
									activeTab === "swap"
										? "bg-blue-500 text-white"
										: "hover:bg-gray-100 text-gray-800"
								}`}
							>
								Swap
							</button>
						</li>
						<li>
							<button
								onClick={() => [
									router.push("/dashboard/favorites"),
									handleClick("favorites"),
								]}
								className={`w-full text-left text-lg py-3 px-4 rounded-lg transition duration-200 ${
									activeTab === "favorites"
										? "bg-blue-500 text-white"
										: "hover:bg-gray-100 text-gray-800"
								}`}
							>
								Favorites
							</button>
						</li>
						<li>
							<button
								onClick={() => [
									router.push("/dashboard/mining"),
									handleClick("mining"),
								]}
								className={`w-full text-left text-lg py-3 px-4 rounded-lg transition duration-200 ${
									activeTab === "mining"
										? "bg-blue-500 text-white"
										: "hover:bg-gray-100 text-gray-800"
								}`}
							>
								Mining
							</button>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default WalletNav;
