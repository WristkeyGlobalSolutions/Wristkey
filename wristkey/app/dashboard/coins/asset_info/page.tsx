"use client";
import { DetailedTokenObject, DetailedNFTObject, getToken, getNFT } from "@/utils/network";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AssetInfo() 
{
    const [asset, setAsset] = useState<DetailedTokenObject | DetailedNFTObject | null>(null);
    const[assetDescription, setAssetDescription] = useState<string | null>(null);

    const type = useSearchParams().get('type');
    const id = useSearchParams().get('id');

    useEffect(() => {
        const fetchAsset = async(id : string | null, type : string | null) =>
        {
            if(id)
            {
                let asset : any;
                if(type == "nft")
                {
                    asset = await getNFT(id);
                    setAsset(asset);
                }
        
                else if(type == "token")
                {
                    asset = await getToken(id);
                    setAsset(asset);
                }

                if(asset)
                {
                    setAssetDescription(asset.description.replace(/<[^>]*>/g, ''));
                }   
            }
            else
            {
                setAsset(null);
            }

        }

        fetchAsset(id, type);
    }, []);

    return(
    <>
        <div className="main container mx-auto p-6 space-y-8">
            <div className="assetInfo text-center">

                <div className="assetTitle">
                    {!asset &&
                    <div>
                        <p>No Asset</p>
                    </div>
                    }

                    {asset &&
                    <div>
                        <p>
                            {asset.name}
                        </p>

                        <br></br>

                        <img
                            src={asset.image_small}
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
    </>)
}