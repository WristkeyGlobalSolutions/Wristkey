import React from "react";

interface CoinCardProps {
	thumb: string;
	name: string;
	price_btc: string;
	volume?: string; // Optional prop for volume
}

const CoinCard: React.FC<CoinCardProps> = ({
	thumb,
	name,
	price_btc,
	volume,
}) => {
	return (
		<li className="p-4 border rounded-md shadow hover:shadow-lg">
			<img
				src={thumb}
				alt={`${name} Image`}
				width={50}
				height={50}
				className="mx-auto"
			/>
			<p className="text-center text-lg font-semibold">{price_btc}</p>
			<p className="text-center mt-2">{name}</p>
			{volume && (
				<p className="text-center text-gray-600">Volume: {volume}</p>
			)}
		</li>
	);
};

export default CoinCard;
