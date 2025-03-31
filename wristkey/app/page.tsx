"use client";
import React, { OptionHTMLAttributes, useEffect, useState } from 'react';
import Link from 'next/link';
import {connectContract, connectWalletViaExtention} from '@/utils/wallet';
import * as network from '@/utils/network';

export default function Home() 
{
    const [wallet, setWallet] = useState<string | null | -1>(null);
    const [contract, setContract] = useState<string | null | -1 | -2 | -3>(null);
    const [networkid, setNetworkID] = useState<string | null>(null);
    const [trending_tokens, setTrendingTokens] = useState<network.TrendingTokenObject[] | null>(null);
    const [trending_nfts, setTrendingNFTs] = useState<network.TrendingNFTObject[] | null>(null);

    //Handles connecting to wallet inside of util
    async function handleWalletConnect()
    {
        let ret = setWallet(await connectWalletViaExtention());
        return ret;
    }

    async function handleContractConnect()
    {
        const ContractAddress = (document.getElementById("ContractAddress") as HTMLInputElement).value;
        return setContract(await connectContract(ContractAddress));
    }

    //Anything updated on startup should go here
    useEffect(() =>
    {
        const fetchTokens = async () =>
        {
            setTrendingTokens((await network.getTrendingTokens()));
        }

        const fetchNFTs = async () =>
            {
                let nfts : network.TrendingNFTObject[] = await network.getTrendingNFTs();
                setTrendingNFTs(nfts);
            }

        const fetchNetwork = async () =>
        {
            setNetworkID(await network.connectNetwork());
        }

        //Connect to network on startup
        fetchNetwork();

        //Fetch trending Tokens
        fetchTokens();

        //fetch trending NFTs
        fetchNFTs();

    }, [])

    return (
        <div className="main">

            <div className="networkStatus">
            {networkid ? 
            (
                <p>Network ID: {networkid}</p>
            ) : 
            (
                <p>Not Connected to Network</p>
            )
            }
            </div>

            <br></br>

            <div className="Contract Address">
                <label>Contract Address:</label>
                <input type="text" id="ContractAddress" name="ContractAddress" style={{color:"#000000"}}>
                </input>
            </div>

            <br></br>

            <div className="connectSmartContractButton">
                {!contract && 
                    <button onClick={handleContractConnect} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Connect Contract
                    </button>
                }

                {contract === -1 && 
                    <button onClick={handleContractConnect} className="bg-red-500 text-white px-4 py-2 rounded">
                    No RPC Provider
                    </button>         
                }

                {contract === -2 && 
                    <button onClick={handleContractConnect} className="bg-red-500 text-white px-4 py-2 rounded">
                    Failed to fetch ABI
                    </button>         
                }

                {contract === -3 && 
                    <button onClick={handleContractConnect} className="bg-red-500 text-white px-4 py-2 rounded">
                    No Contract Address provided
                    </button>         
                }

                {typeof contract === "string" &&
                    <button onClick={handleContractConnect} className="bg-green-500 text-white px-4 py-2 rounded">
                    Contract Address: {contract}
                    </button>
                }
            </div>

            <br></br>

            <div className="connectWalletButton">
                {!wallet && 
                    <button onClick={handleWalletConnect} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Connect Wallet Via Web-Extention
                    </button>
                }

                {wallet === -1 &&
                <button onClick={handleWalletConnect} className="bg-red-500 text-white px-4 py-2 rounded">
                No RPC Provider
                </button>         
                }

                {typeof wallet === "string" &&
                <button onClick={handleWalletConnect} className="bg-green-500 text-white px-4 py-2 rounded">
                Status: Connected
                </button>
                }
            </div>

            <br></br>

            <div className="trendingList">
                <p>Trending Coins:</p>
                {trending_tokens ? 
                (    
                    <ul>
                    {trending_tokens.map((token, index) => 
                    (
                    <li key={index}>
                        <p>
                            <br></br>
                            <img src={token.thumb} alt="Example Image" />
                            {token.name} 
                            <br></br>
                            BTC: {token.price_btc}
                        </p>
                    </li>
                    ))}
                </ul>
                ) 
                : 
                (<p>No Trending Tokens</p>)
                }

                <br></br>

                <p>Trending NFTs:</p>
                {trending_nfts ? 
                (    
                    <ul>
                    {trending_nfts.map((nft, index) => 
                    (
                    <li key={index}>
                        <p>
                            <br></br>
                            <img src={nft.thumb} alt="Example Image" />
                            {nft.name} 
                            <br></br>
                            Price: {nft.native_currency_symbol} {nft.floor_price_in_native_currency}
                            <br></br>
                            Volume: {nft.native_currency_symbol} {nft.data.h24_volume}
                        </p>
                    </li>
                    ))}
                </ul>
                ) 
                : 
                (<p>No Trending NFTs</p>)
                }
            </div>

            <div className="directory">
                <Link href="/staking" className="text-blue-600 underline mr-4">
                Staking
                </Link>
                <Link href="/security" className="text-red-600 underline">
                Security
                </Link>
            </div>
        </div>
    );
}

