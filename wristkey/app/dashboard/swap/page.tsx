"use client";
import React, { useEffect, useState } from 'react';
import WalletNav from "@/components/UI/WalletNav";
import Dropdown from "@/components/UI/Dropdown";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { asset } from '../portfolio/api';


const Swap = () => {

    const { user, refreshUser } = useAuth();
    const [amount, setAmount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [isSwapped, setIsSwapped] = useState(false);
    const [message, setMessage] = useState("");

    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<asset | null>(null);

    const handleDropdownSelect = (address: string, asset: asset) => 
    {
        setSelectedAddress(address);
        setSelectedAsset(asset);
    }

    const parse = (val: string) => 
    {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

//This needs to properly display the updated token max amount
    const handleChange = (val: string, isMain: boolean) => 
    {
        if (val === "") 
        {
            setAmount(0);
            return;
        }

        if(selectedAsset && selectedAsset.balance)
        {
            setBalance(parseFloat(selectedAsset.balance));
        }
        else
        {
            setBalance(0);
        }

        const num = parse(val);
        const updated = isMain ? num : num * 2;

        if (updated <= balance) 
        {
            setAmount(updated);
        }
    };

 const mainValue = amount || 0;
 const secondaryValue = isSwapped ? mainValue * 2 : mainValue / 2;

 // Shared box UI
 const Box = ({
    value,
    onChange,
    balance,
    isMainBox,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    balance: number;
    isMainBox: boolean;
  }) => (
    <div className="bg-white border-2 border-gray-300 rounded-2xl h-20 px-4 py-2 flex items-center justify-between">
      <div>
        {/* Dynamically switch dropdown options based on isSwapped */}
        <Dropdown onSelect={handleDropdownSelect}/>
        <p className="text-sm text-gray-500 mt-1">Balance: {balance}</p>
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="text-gray-400 text-3xl text-right w-20 focus:outline-none bg-transparent"
      />
    </div>
  );

  const handleExchange = () => {
    setMessage("Exchange made");
    // Optional: Reset the message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
	  <div className="bg-gradient-to-r from-blue-700 to-blue-950">
		  <WalletNav currentTab='swap'/>
    <div className="bg-gray-100 min-h-screen rounded-t-3xl p-2">
        <h1 className="text-4xl text-center p-2">Swap</h1>
        <div className="transparent rounded-3xl p-4 space-y-4 max-w-md mx-auto">
            {/* Top Box (changes with swap) */}
            <p>Pay with: </p>
            {!isSwapped ? (
                <Box
                value={amount.toString()}
                onChange={(e) => handleChange(e.target.value, true)}
                balance={balance}
                isMainBox={true}
                />
            ) : (
                <Box
                value={(amount / 2).toString()}
                onChange={(e) => handleChange(e.target.value, false)}
                balance={balance}
                isMainBox={false}
                />
            )}

            {/* Swap Button */}
            <div className="flex justify-center">
                <button
                onClick={() => setIsSwapped(!isSwapped)}
                className="bg-gray-200 hover:bg-gray-400 text-black text-sm px-4 py-2 rounded-full shadow"
                >
                    Switch
                </button>
            </div>

            {/* Bottom Box (changes with swap) */}
            <p>Recieve: </p>
            {isSwapped ? (
                <Box
                value={amount.toString()}
                onChange={(e) => handleChange(e.target.value, true)}
                balance={balance}
                isMainBox={true}
                />
            ) : (
                <Box
                value={(amount / 2).toString()}
                onChange={(e) => handleChange(e.target.value, false)}
                balance={balance}
                isMainBox={false}
                />
            )}
        
        <div className="flex justify-center">
            <button
             onClick={handleExchange}
             className="bg-black hover:text-gray-300 text-white text-sm w-full h-10 px-4 py-2 rounded-lg shadow"
            >
                <p>Make Exchange</p>
            </button>
        </div>
        <div>
            {message && (
              <p className="mt-2 text-green-600 text-sm font-medium">
                {message}
              </p>
            )}
        </div>
      </div>
    </div>
  </div>
  ); // end return
};

export default Swap;