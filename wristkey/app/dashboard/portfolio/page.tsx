"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { connectContract, connectWalletViaExtention } from "@/utils/wallet";
import * as network from "@/utils/network";
import CoinCard from "@/components/coinCard";
import WalletNav from "@/components/UI/WalletNav";

const Portfolio = () => {

  const [activeTab, setActiveTab] = useState<'mywallet' | 'nfts'>('mywallet')
  const [networkid, setNetworkID] = useState<string | null>(null);
	const [trending_tokens, setTrendingTokens] = useState<
		network.TokenObject[] | null
	>(null);
	const [trending_nfts, setTrendingNFTs] = useState<
		network.NFTObject[] | null
	>(null);

  const handleClick = (page: 'mywallet' | 'nfts') => {
    setActiveTab(page);
  };

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
      <div className="transparent flex min-h-screen p-2">
        <WalletNav />
        {/* Wallet  Choices */}
        <div className="flex-1 px-6 overflow-x-auto">
          <div className="flex justify-center">
            <button
              className="w-full py-2 text-center text-xl hover:bg-gray-300"
              onClick={() => handleClick('mywallet')}
            >
              My Wallet
            </button>
            <button
              className="w-full py-2 text-center text-xl hover:bg-gray-300"
              onClick={() => handleClick('nfts')}
            >
              NFT Collection
            </button>
          </div>

          <div>
            {/* Table Section for My Coins */}
            {activeTab === 'mywallet' ? (
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Asset</th>
                    <th className="py-2 px-4 border-b text-right">Balance</th>
                    <th className="py-2 px-4 border-b text-right">Value</th>
                    <th className="py-2 px-4 border-b text-right">Change</th>
                    <th className="py-2 px-4 border-b text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">Bitcoin</td>
                    <td className="py-2 px-4 border-b text-right">0.0</td>
                    <td className="py-2 px-4 border-b text-right">0%</td>
                    <td className="py-2 px-4 border-b text-right">$18.00</td>
                    <td className="py-2 px-4 border-b text-right">0</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Ethereum</td>
                    <td className="py-2 px-4 border-b text-right">0.0</td>
                    <td className="py-2 px-4 border-b text-right">0%</td>
                    <td className="py-2 px-4 border-b text-right">$20.00</td>
                    <td className="py-2 px-4 border-b text-right">0</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">USDT</td>
                    <td className="py-2 px-4 border-b text-right">0.0</td>
                    <td className="py-2 px-4 border-b text-right">0%</td>
                    <td className="py-2 px-4 border-b text-right">$5.00</td>
                    <td className="py-2 px-4 border-b text-right">0</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Avax</td>
                    <td className="py-2 px-4 border-b text-right">0.0</td>
                    <td className="py-2 px-4 border-b text-right">0%</td>
                    <td className="py-2 px-4 border-b text-right">$5.00</td>
                    <td className="py-2 px-4 border-b text-right">0</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Aptos</td>
                    <td className="py-2 px-4 border-b text-right">0.0</td>
                    <td className="py-2 px-4 border-b text-right">0%</td>
                    <td className="py-2 px-4 border-b text-right">$5.00</td>
                    <td className="py-2 px-4 border-b text-right">0</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Agoric</td>
                    <td className="py-2 px-4 border-b text-right">0.0</td>
                    <td className="py-2 px-4 border-b text-right">0%</td>
                    <td className="py-2 px-4 border-b text-right">$5.00</td>
                    <td className="py-2 px-4 border-b text-right">0</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Filecoin</td>
                    <td className="py-2 px-4 border-b text-right">0.0</td>
                    <td className="py-2 px-4 border-b text-right">0%</td>
                    <td className="py-2 px-4 border-b text-right">$5.00</td>
                    <td className="py-2 px-4 border-b text-right">0</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">BNB</td>
                    <td className="py-2 px-4 border-b text-right">0.0</td>
                    <td className="py-2 px-4 border-b text-right">0%</td>
                    <td className="py-2 px-4 border-b text-right">$5.00</td>
                    <td className="py-2 px-4 border-b text-right">0</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Asset</th>
                  <th className="py-2 px-4 border-b text-right">Balance</th>
                  <th className="py-2 px-4 border-b text-right">Value</th>
                  <th className="py-2 px-4 border-b text-right">Change</th>
                  <th className="py-2 px-4 border-b text-right">Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">Bitcoin</td>
                  <td className="py-2 px-4 border-b text-right">0.0</td>
                  <td className="py-2 px-4 border-b text-right">0%</td>
                  <td className="py-2 px-4 border-b text-right">$18.00</td>
                  <td className="py-2 px-4 border-b text-right">0</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Ethereum</td>
                  <td className="py-2 px-4 border-b text-right">0.0</td>
                  <td className="py-2 px-4 border-b text-right">0%</td>
                  <td className="py-2 px-4 border-b text-right">$20.00</td>
                  <td className="py-2 px-4 border-b text-right">0</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">USDT</td>
                  <td className="py-2 px-4 border-b text-right">0.0</td>
                  <td className="py-2 px-4 border-b text-right">0%</td>
                  <td className="py-2 px-4 border-b text-right">$5.00</td>
                  <td className="py-2 px-4 border-b text-right">0</td>
                </tr>
              </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
