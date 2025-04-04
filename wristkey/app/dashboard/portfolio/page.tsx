"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { connectContract, connectWalletViaExtention } from "@/utils/wallet";
import * as network from "@/utils/network";
import CoinCard from "@/components/coinCard";

const Portfolio = () => {

  const [networkid, setNetworkID] = useState<string | null>(null);
	const [trending_tokens, setTrendingTokens] = useState<
		network.TokenObject[] | null
	>(null);
	const [trending_nfts, setTrendingNFTs] = useState<
		network.NFTObject[] | null
	>(null);

  useEffect(() => {
		const fetchTokens = async () => {
			setTrendingTokens(await network.getTrendingTokens());
		};

		const fetchNFTs = async () => {
			const nfts: network.NFTObject[] =
				await network.getTrendingNFTs();
			setTrendingNFTs(nfts);
		};

		const fetchNetwork = async () => {
			setNetworkID(await network.connectNetwork());
		};

		//Connect to network on startup
		fetchNetwork();

		//Fetch trending Tokens
		fetchTokens();

		//fetch trending NFTs
		fetchNFTs();
	}, []);

  return (
    <div>
      {/* Header */}
      <div className="transparent p-8">
        <h1 className="text-gray-500 text-center font-bold text-7xl">$210,101</h1>
        <h1 className="text-center text-3xl text-green-500">+2.5%</h1>
      </div>

      {/* White section content with a table below the buttons */}
      <div className="background p-2">
        {/* Table */}
        <div>
          <table className="min-w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Asset</th>
                <th className="py-2 px-4 border-b text-left">Balance</th>
                <th className="py-2 px-4 border-b text-left">Value</th>
                <th className="py-2 px-4 border-b text-left">Change</th>
                <th className="py-2 px-4 border-b text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b flex items-center">Bitcoin</td>
                <td className="py-2 px-4 border-b">0.0</td>
                <td className="py-2 px-4 border-b">0%</td>
                <td className="py-2 px-4 border-b">$18.00</td>
                <td className="py-2 px-4 border-b">0</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b flex items-center">Ethereum</td>
                <td className="py-2 px-4 border-b">0.0</td>
                <td className="py-2 px-4 border-b">0%</td>
                <td className="py-2 px-4 border-b">$20.00</td>
                <td className="py-2 px-4 border-b">0</td>
              </tr>
              <tr>
              <td className="py-2 px-4 border-b flex items-center">USDT</td>
                <td className="py-2 px-4 border-b">0.0</td>
                <td className="py-2 px-4 border-b">0%</td>
                <td className="py-2 px-4 border-b">$5.00</td>
                <td className="py-2 px-4 border-b">0</td>
              </tr>
              <tr>
              <td className="py-2 px-4 border-b flex items-center">Avax</td>
                <td className="py-2 px-4 border-b">0.0</td>
                <td className="py-2 px-4 border-b">0%</td>
                <td className="py-2 px-4 border-b">$5.00</td>
                <td className="py-2 px-4 border-b">0</td>
              </tr>
              <tr>
              <td className="py-2 px-4 border-b flex items-center">Aptos</td>
                <td className="py-2 px-4 border-b">0.0</td>
                <td className="py-2 px-4 border-b">0%</td>
                <td className="py-2 px-4 border-b">$5.00</td>
                <td className="py-2 px-4 border-b">0</td>
              </tr>
              <tr>
              <td className="py-2 px-4 border-b flex items-center">Agoric</td>
                <td className="py-2 px-4 border-b">0.0</td>
                <td className="py-2 px-4 border-b">0%</td>
                <td className="py-2 px-4 border-b">$5.00</td>
                <td className="py-2 px-4 border-b">0</td>
              </tr>
              <tr>
              <td className="py-2 px-4 border-b flex items-center">Filecoin</td>
                <td className="py-2 px-4 border-b">0.0</td>
                <td className="py-2 px-4 border-b">0%</td>
                <td className="py-2 px-4 border-b">$5.00</td>
                <td className="py-2 px-4 border-b">0</td>
              </tr>
              <tr>
              <td className="py-2 px-4 border-b flex items-center">BNB</td>
                <td className="py-2 px-4 border-b">0.0</td>
                <td className="py-2 px-4 border-b">0%</td>
                <td className="py-2 px-4 border-b">$5.00</td>
                <td className="py-2 px-4 border-b">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
