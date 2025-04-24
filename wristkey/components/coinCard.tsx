import { useRouter } from 'next/navigation';
import React from "react";

interface CoinCardProps 
{
	thumb: string;
	name: string;
	price: string;
	volume?: string; // Optional prop for volume
    identifier? : string;
    id? : string;
}

const CoinCard: React.FC<CoinCardProps> = (
{
	thumb,
	name,
	price,
	volume,
    identifier,
    id
}) => 
{
    
const router = useRouter();
	return (
		<button 
        className="p-4 border w-96 rounded-md shadow hover:shadow-lg"
        onClick={() => router.push(`/dashboard/coins/asset_info?type=${identifier}&id=${id}`)}
        >
			<img
				src={thumb as "image"}
				alt={`${name} Image`}
				width={50}
				height={50}
				className="mx-auto"
			/>

            <p className="text-center mt-2">{name}</p>
			<p className="text-center text-lg font-semibold">{price}</p>
			
			{volume && (
				<p className="text-center text-gray-600">Volume: {volume}</p>
			)}
		</button>
	);
};

export default CoinCard;
