import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from "react";
import {
	addFavoriteToUser,
	getFavoritesForUser,
	removeFavoriteFromUser,
} from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";

interface CoinCardProps 
{
	thumb: string | undefined | null;
	name: string | undefined | null;
	price?: string; //made optional
	volume?: string; // Optional prop for volume
    identifier? : string;
    address? : string;
}

const CoinCard: React.FC<CoinCardProps> = (
{
	thumb,
	name,
	price,
	volume,
    identifier,
    address
}) => 
{

const router = useRouter();
const [favorited, setFavorited] = useState<boolean>(false);
const { user } = useAuth();
const type = useSearchParams().get("type");
const assetAddress = useSearchParams().get("address");

const favoriteAsset = async () => {
		if (user && assetAddress && type) {
			const prevState = favorited;
			setFavorited(!prevState);
			const favorites = await getFavoritesForUser(user);
			if (!favorites.map((f) => f.address).includes(assetAddress)) {
				addFavoriteToUser(user, assetAddress, type);
			} else {
				removeFavoriteFromUser(user, assetAddress);
			}
		}
	};

	return (
		<div className="flex">
			<button 
        		className="bg-transparent flex columns-5 w-full h-24 hover:bg-gray-200"
        		onClick={() => router.push(`/dashboard/coins/asset_info?type=${identifier}&address=${address}`)}
        	>
			<div className="flex items-center w-2/5">
				<img
					src={thumb as "image"}
					alt={`${name} Image`}
					width={50}
					height={50}
					className="ml-4"
				/>
            	<p className="ml-4 mt-2">{name}</p>
			</div>
			<div className="flex items-center w-1/5">
				<p className="text-lg font-semibold">{price}</p>
			</div>
			<div className="flex items-center w-1/5">
				<p className="text-red-600">change</p>
			</div>
			<div className="flex items-center w-1/5">
				<p className="">marketcap</p>
			</div>
			<div className="w-1/5"></div>
			{volume && (
				<p className="text-center text-gray-600">Volume: {volume}</p>
			)}
			</button>
			
			<div className="flex absolute right-44 mt-6">
				<button
					onClick={favoriteAsset}
					className={`w-10 h-10 flex justify-center items-center rounded-full shadow transition ${
					favorited
						? "bg-red-500 text-white hover:bg-red-600"
						: "bg-gray-300 text-gray-700 hover:bg-gray-400"
					}`}
					aria-label="Favorite"
				>
					{favorited ? "♥" : "♡"}
				</button>
			</div>
		</div>
	);
};

export default CoinCard;