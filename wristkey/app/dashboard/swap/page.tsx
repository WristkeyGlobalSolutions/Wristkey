"use client"
import React, { useEffect, useState } from 'react';
import WalletNav from "@/components/UI/WalletNav";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { asset } from '../portfolio/api';
import { getSwapQuoteReadOnly, SwapParams } from './api';
import FromDropdown from '@/components/UI/FromDropdown';
import ToDropdown from '@/components/UI/ToDropdown';


const Swap = () => {

    //const { user, refreshUser } = useAuth();
    const [fromAmount, setFromAmount] = useState(0); //amount currently typed into FromBox
    const [toAmount, setToAmount] = useState(0); //amount converted to ToBox

    const [balance, setBalance] = useState(0); //balance of asset selected in FromBox
    const [isSwapped, setIsSwapped] = useState(false);
    const [message, setMessage] = useState("");

    //Asset we will swap to
    const [toAsset, setToAsset] = useState<[string, asset] | null>(null);
    
    //Asset we are swapping with
    const [fromAsset, setFromAsset] = useState<[string, asset] | null>(null);

    const handleToDropdownSelect = (name: string, asset: asset) => 
    {
        setToAsset([name, asset]);
        console.log("From asset " + name);
    }

    const handleFromDropdownSelect = (name: string, asset: asset) => 
    {
        setFromAsset([name, asset]);
        setBalance(parseFloat(asset.balance ?? "0")); //Set the balance on From update
        console.log("To asset " + name);
    }

    useEffect(() => {

    }, [fromAmount]
    )

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
            setFromAmount(0);
            return;
        }

        const num = parse(val);
        const updated = isMain ? num : num * 2;

        if (updated <= balance) 
        {
            setFromAmount(updated);
        }
    };

 const mainValue = fromAmount || 0;

 // Shared box UI
 const ToBox = ({value, onChange, isMainBox}: 
    {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isMainBox: boolean;
    }) => (
    <div className="bg-white border-2 border-gray-300 rounded-2xl h-20 px-4 py-2 flex items-center justify-between">
      <div>
        {/* Dynamically switch dropdown options based on isSwapped */}
        <ToDropdown onSelect={handleToDropdownSelect}/>
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="text-gray-400 text-3xl text-right w-20 focus:outline-none bg-transparent"
      />
    </div>
  );

  const FromBox = ({value, onChange, balance, isMainBox}: 
    {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    balance: number;
    isMainBox: boolean;
    }) => (
    <div className="bg-white border-2 border-gray-300 rounded-2xl h-20 px-4 py-2 flex items-center justify-between">
      <div>
        {/* Dynamically switch dropdown options based on isSwapped */}
        <FromDropdown onSelect={handleFromDropdownSelect}/>
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
                <FromBox
                value={fromAmount.toString()}
                onChange={(e) => handleChange(e.target.value, true)}
                balance={balance}
                isMainBox={true}
                />
            ) : (
                <ToBox
                value={toAmount.toString()}
                onChange={(e) => handleChange(e.target.value, false)}
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
            {!isSwapped ? (
                <ToBox
                value={toAmount.toString()}
                onChange={(e) => handleChange(e.target.value, true)}
                isMainBox={true}
                />
            ) : (
                <FromBox
                value={fromAmount.toString()}
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