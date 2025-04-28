"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const WalletNav: React.FC = () => {
	
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<'portfolio' | 'explore' | 'swap' | 'favorites' | 'mining'>('portfolio');
	  const handleClick = (page: 'portfolio' | 'explore' | 'swap' | 'favorites' | 'mining') => {
		setActiveTab(page);
	  };

	return (
		<div className="flex flex-col bg-white text-black w-64 border-collapse fixed">
			<ul className="flex-col border-2">
				<li>
					<button
						onClick={() => [router.push("/dashboard/portfolio"), handleClick('portfolio')]}
						className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 border-b border-gray-300 ${activeTab === 'portfolio' ? 'bg-gray-300' : ''}`}
					>
						Portfolio
					</button>
				</li>
				<li>
					<button
						onClick={() => [router.push("/dashboard/coins"), handleClick('explore')]}
						className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 border-b border-gray-300 ${activeTab === 'explore' ? 'bg-gray-300' : ''}`}
					>
						Explore
					</button>
				</li>
				<li>
					<button 
						onClick={() => [router.push("/dashboard/swap"), handleClick('swap')]}
						className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 border-b border-gray-300 ${activeTab === 'swap' ? 'bg-gray-300' : ''}`}
						>
						Swap
					</button>
				</li>
				<li>
					<button 
						onClick={() => [router.push("/dashboard/favorites"), handleClick('favorites')]}
						className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 border-b border-gray-300 ${activeTab === 'favorites' ? 'bg-gray-300' : ''}`}
						>
						Favorites
					</button>
				</li>
				<li>
					<button 
						onClick={() => [router.push("/dashboard/mining"), handleClick('mining')]}
						className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 border-gray-300 ${activeTab === 'mining' ? 'bg-gray-300' : ''}`}
						>
						Mining
					</button>
				</li>
			</ul>
		</div>
	);
};

export default WalletNav;