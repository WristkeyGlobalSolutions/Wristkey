"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as API from "../api";
import { Alchemy, Network } from "alchemy-sdk";

const settings = 
{
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
};

export default function AssetInfo() 
{
    const [nft, setNft] = useState<API.NFTCollection | undefined | null>(null);
    const [token, setToken] = useState<API.Token | undefined | null>(null);
    const[assetDescription, setAssetDescription] = useState<string | null>(null);

    const type = useSearchParams().get('type');
    const address = useSearchParams().get('address');

    useEffect(() => {
        const fetchAsset = async(id : string | null, type : string | null) =>
        {
            if(address)
            {
                let asset : API.NFTCollection | API.Token | undefined;
                if(type == "nft")
                {
                    asset = await API.NFTFromContract(alchemy, address);
                    setNft(asset);
                }
        
                else if(type == "token")
                {
                    asset = await API.TokenFromContract(alchemy, address);
                    setToken(asset);
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
