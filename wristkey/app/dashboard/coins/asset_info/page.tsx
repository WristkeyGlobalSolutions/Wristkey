"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as API from "../api";
import { Alchemy, Network } from "alchemy-sdk";
import { useAuth } from "@/context/AuthContext";
import { addFavoriteToUser, getFavoritesForUser, removeFavoriteFromUser } from "@/lib/firestore";

const settings = 
{
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
};

export default function AssetInfo() 
{
    const [nft, setNft] = useState<API.NFTCollection | undefined | null>(null);
    const [token, setToken] = useState<API.Token | undefined | null>(null);
    const[assetDescription, setAssetDescription] = useState<string | undefined | null>(null);
    const[assetAddress, setAssetAddress] = useState<string | undefined | null>(null);

    const { user, logout, loading } = useAuth();
    const type = useSearchParams().get('type');
    const address = useSearchParams().get('address');

    async function favoriteAsset()
    {
        if(user && assetAddress)
        {
            let favorites = await getFavoritesForUser(user);
        
            if(!favorites.includes(assetAddress))
            {
                addFavoriteToUser(user, assetAddress);
            }
            else
            {
                removeFavoriteFromUser(user, assetAddress);
            }
        }

    }

    useEffect(() => {
        const fetchAsset = async(address : string | null, type : string | null) =>
        {
            if(address)
            {
                
                let asset : API.NFTCollection | API.Token | undefined;
                if(type == "nft")
                {
                    try
                    {
                        asset = await API.NFTFromContract(alchemy, address);
                        setNft(asset);
                        setAssetAddress(asset?.contract_address);
                    }
                    catch(e)
                    {

                    }
                }
        
                else if(type == "token")
                {
                    try
                    {
                        asset = await API.TokenFromContract(alchemy, address);
                        setToken(asset);
                        setAssetAddress(asset?.token_addresses.address);
                    }
                    catch(e)
                    {

                    }
                }
            }
            else
            {
                setToken(null);
                setNft(null);
            }
        }

        const alchemy = new Alchemy(settings);

        fetchAsset(address, type);
    }, []);

    return(

        <div className="bg-gradient-to-r from-blue-700 to-blue-950 w-full">
            <div className="bg-gray-100 rounded-t-3xl min-h-screen w-full text-center">

                <div className="assetTitle">
                    {!nft && !token &&
                    <div>
                        <p>No Asset</p>
                    </div>
                    }

                    {nft &&
                    <div>
                        <p>
                            {nft.nfts[0].collection?.name}
                        </p>

                        <br></br>

                        <img
                            src={nft.nfts[0].collection?.bannerImageUrl as "image"}
                            alt={`${name} Image`}
                            width={50}
                            height={50}
                            className="mx-auto"
                        />

                    </div>    
                    }

                    {token &&
                    <div>
                        <p>
                            {token.metadata.name}
                        </p>

                        <br></br>

                        <img
                            src={token.metadata.logo as "image"}
                            alt={`${name} Image`}
                            width={50}
                            height={50}
                            className="mx-auto"
                        />

                    </div>    
                    }
                </div>


                <br></br>

                <button
                    onClick={() => favoriteAsset}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
                >
                    Favorite
                </button>

                <div className="Description">
                    {!assetDescription &&
                        <p>No Description</p>
                    }


                    {assetDescription &&
                    <div>
                        <p>
                            {assetDescription}
                        </p>
                    </div>
                    }   
                </div>

            </div>
        </div>
    )
}
