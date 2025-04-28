import { useRouter } from 'next/navigation';
import React from "react";

interface CoinCardProps 
{
	thumb: string | undefined | null;
	name: string | undefined | null;
	price: string;
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
	return (
		<button 
         className="bg-white p-4 w-96 h-56 border rounded-md shadow hover:shadow-lg"
         onClick={() => router.push(`/dashboard/coins/asset_info?type=${identifier}&address=${address}`)}
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