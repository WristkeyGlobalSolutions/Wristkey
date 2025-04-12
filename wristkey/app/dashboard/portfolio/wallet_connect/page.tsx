"use client";
import React, { useEffect, useState } from 'react';
import * as wallet from "../api";
import { useRouter } from 'next/navigation';
import { connectNetwork } from '@/utils/network';

const wallet_connect = () =>
{
    //Handles connecting to wallet inside of util
    async function handleWalletConnectViaExtention() 
    {
        const new_wallet_address = await wallet.connectWalletViaExtention();
    }

    async function handleInput(event : React.KeyboardEvent<HTMLInputElement>)
    {
        if(event.code == "Enter" && event.currentTarget.id == "InputBar")
        {
            let input = (document.getElementById("InputBar") as HTMLInputElement).value;
            let _test = input;
            //This is a seeded phrase
            if(_test.trim().split(/\s+/).length === 12)
            {
                wallet.connectWalletViaPhrase(input);
            }
            //This is an address
            else
            {
                wallet.connectWalletViaAddress(input);
            }
        }
    }

    useEffect(() => {
        connectNetwork();
    }, []);

    const router = useRouter();

    return(
        <div className="connectWalletButton text-center">


            <div className="input-bar space-y-2">
					<input
						type="text"
						id="InputBar"
						name="InputBar"
						className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Input phrase or address..."
                        style={{color: "black"}}
                        onKeyDown={(event) => handleInput(event)}
                    />
				</div>

                <br></br>

                <button
                    onClick={handleWalletConnectViaExtention}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
                >
                    Connect Wallet Via Web-Extension
                </button>

                <br></br>

                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
                    onClick={() => router.push(`/dashboard/portfolio`)}
                >
                    Return
                </button>
        </div>
    );
};

export default wallet_connect;