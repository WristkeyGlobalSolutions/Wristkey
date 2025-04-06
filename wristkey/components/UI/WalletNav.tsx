"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust the path as needed
import { useRouter, usePathname } from "next/navigation";
import Dropdown from "./Dropdown";

const WalletNav: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"mywallet" | "nfts">("mywallet");
	const router = useRouter();
	const pathname = usePathname();
	const location = pathname == "/";

	return (
		<div className="flex flex-col transparent text-black w-64">
			<ul className="flex flex-col border-2">
				<li>
					<button
						onClick={() => router.push("../dashboard/portfolio")}
						className={
							"hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 border-b border-gray-300"
						}
					>
						Portfolio
					</button>
				</li>
				<li>
					<button
						onClick={() => router.push("../dashboard/coins")}
						className="hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 border-b border-gray-300"
					>
						Explore
					</button>
				</li>
				<li>
					<button className="hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 border-b border-gray-300">
						Swap
					</button>
				</li>
				<li>
					<button className="hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 border-b border-gray-300">
						Favorites
					</button>
				</li>
				<li>
					<button className="hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 border-b border-gray-300">
						Mining
					</button>
				</li>
			</ul>
		</div>
	);
};

export default WalletNav;
