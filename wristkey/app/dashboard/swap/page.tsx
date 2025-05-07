"use client"
import React, { useEffect, useState } from 'react';
import WalletNav from "@/components/UI/WalletNav";
import ToDropdown, { ToDropdownProvider, useToDropdown } from '@/components/UI/ToDropdown';
import FromDropdown, { FromDropdownProvider, useFromDropdown } from "@/components/UI/FromDropdown";
import { TokenPriceFromContract, TokenFromContract } from '../coins/api';
import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { useWallets } from '../mining/managewallets/api';
import { Wallet } from '@/lib/firestore';

const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
};

let alchemy : Alchemy;

const SwapInner = () => {

    //TODO: needs input for decimals, needs to be able to check for multiple inputs
    //i.e., when you input 10 it only accounts for the `1`
    const [isSwapped, setIsSwapped] = useState(false);
    const [message, setMessage] = useState("");

    const{fromName, fromAsset, setFromDropdown} = useFromDropdown();
    const{toName, toAsset, setToDropdown} = useToDropdown();

    const[fromAmount, setFromAmount] = useState(0);
    const[fromBalance, setFromBalance] = useState(0);
    const[toAmount, setToAmount] = useState(0); //Used to convert

    //Default to null so that code knows when none are selected
    const[fromAddress, setFromAddress] = useState<string | null>(null);
    const[toAddress, setToAddress] = useState<string | null>(null);

    //Set this so we know when swapping is valid
    const[cannotSwap, setCannotSwap] = useState(false);

     const{wallets, refreshWallets} = useWallets();

    //Initializing useEffect
    useEffect(() => {
        alchemy = new Alchemy(settings);
    }, [])

    //update toAsset address
    useEffect(() => {
        if(toAsset && toAsset.address) setToAddress(toAsset.address);
    }, [toAsset])

    /*
        On change of fromAmount, toAddres, or fromAddress update the toAmount
    */
    useEffect(() => {
        console.log("called");
        const fetchToAmount = async() =>
        {
            if(toAddress && fromAddress) setToAmount(await convertCurrency(fromAmount, toAddress, fromAddress));
        }

        fetchToAmount();
        
    }, [fromAmount, toAddress, fromAddress])

    //Update the current balance
    useEffect(() => {
        if(fromAsset && fromAsset.balance)  setFromBalance(parseFloat(fromAsset.balance));
        if(fromAsset && fromAsset.address) setFromAddress(fromAsset.address);

        if(!fromAsset || !fromAsset.address) setCannotSwap(false) 
        else setCannotSwap(true)
    }, [fromAsset])

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

        if (updated <= fromBalance) 
        {
            setFromAmount(updated);
        }
    };

    const convertCurrency = async(amount : number, fromAddress : string, toAddress : string) =>
    {
        //Get the prices for each token
        let toTokenPrice = await TokenPriceFromContract(alchemy, toAddress);
        let fromTokenPrice = await TokenPriceFromContract(alchemy, fromAddress);

        //Make sure they exist
        if(fromTokenPrice && toTokenPrice)
        {
            setCannotSwap(false);
            let converted = (amount/fromTokenPrice) * toTokenPrice;
            return converted;
        }
        
        //If they do not exist make sure we know we canno
        setCannotSwap(true);
        return 0;
    }

 const mainValue = fromAmount || 0;

 // Shared box UI
 const ToBox = ({value, onChange}: 
    {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) => (
    <div className="bg-white border-2 border-gray-300 rounded-2xl h-20 px-4 py-2 flex items-center justify-between">
      <div>
        {/* Dynamically switch dropdown options based on isSwapped */}
        <ToDropdown/>
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="text-gray-400 text-3xl text-right w-20 focus:outline-none bg-transparent"
      />
    </div>
  );

  const FromBox = ({value, onChange, balance}: 
    {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    balance: number;
    }) => (
    <div className="bg-white border-2 border-gray-300 rounded-2xl h-20 px-4 py-2 flex items-center justify-between">
      <div>
        {/* Dynamically switch dropdown options based on isSwapped */}
        <FromDropdown/>
        <p className="text-sm text-gray-500 mt-1">Balance: {fromBalance}</p>
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="text-gray-400 text-3xl text-right w-20 focus:outline-none bg-transparent"
      />
    </div>
  );

    const handleExchange = () => 
    {
        if(cannotSwap)
        {
            setMessage("Cannot swap");
        }
        else
        {
            setMessage("Exchange made");
        }

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
                value={fromAmount}
                onChange={(e) => handleChange(e.target.value, true)}
                balance={fromBalance}
                />
            ) : (
                <ToBox
                value={toAmount}
                onChange={(e) => handleChange(e.target.value, false)}
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
                value={toAmount}
                onChange={(e) => handleChange(e.target.value, true)}
                />
            ) : (
                <FromBox
                value={fromAmount}
                onChange={(e) => handleChange(e.target.value, false)}
                balance={fromBalance}
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
  );
};

//Need to wrap into the providers
const Swap = () => (
    <FromDropdownProvider>
        <ToDropdownProvider>
            <SwapInner/>
        </ToDropdownProvider>
    </FromDropdownProvider>
  );

export default Swap;