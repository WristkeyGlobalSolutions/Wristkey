"use client";
import React, { useEffect, useState } from 'react';
import { getContract, connectWalletViaExtention } from "./api";
import WalletNav from "@/components/UI/WalletNav";
import { useRouter } from 'next/navigation';

const Portfolio = () => {

  const [activeTab, setActiveTab] = useState<'mywallet' | 'nfts'>('mywallet')

  const handleClick = (page: 'mywallet' | 'nfts') => {
    setActiveTab(page);

  };

  useEffect(() => {

	}, []);

    const router = useRouter();

  return (

    <div>
      {/* Header */}
      <div className="transparent p-8">
        <h1 className="text-gray-500 text-center font-bold text-7xl">$210,101</h1>
        <h1 className="text-center text-3xl text-green-500">+2.5%</h1>
      </div>

        <div className="connectWalletButton text-center">
            {
                <button
                    onClick={() => router.push(`/dashboard/portfolio/wallet_connect`)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
                >
                    Connect Wallet
                </button>
            }
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
