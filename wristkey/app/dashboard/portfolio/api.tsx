import { FirestoreUser } from "@/context/AuthContext";
import { Token, TokenPriceFromContract } from "../coins/api";
import { ALCgetTokens, getWallets } from "../mining/managewallets/api";
import { Alchemy } from "alchemy-sdk";
import { Wallet as WalletType } from "@/lib/firestore";

export type asset = {
    balance: string | undefined;
    value: number;
    change: number;
    percentage: string;
    address : string;
};

export async function get_wallet_data_cheap(user : FirestoreUser | null, alchemy : Alchemy, wallets : WalletType[] | null) : Promise<Map<string, asset> | null>
{
    if (user && wallets) 
        {
            let wallet_data: Map<string, [Token, string][]> = new Map();
            let token_data: Map<Token, string> = new Map();
    
            const assetMap = new Map<string, asset>();
    
            if (wallets) 
                {
                for (let i = 0; i < wallets.length; i++) {
                    let tokens = await ALCgetTokens(alchemy, wallets[i].address);
                    wallet_data.set(wallets[i].address, tokens);
    
                    //Get the total for this token's amount
                    tokens.forEach((data: [Token, string]) => {
                        if (token_data.has(data[0])) {
                            token_data.set(
                                data[0],
                                `${
                                    parseFloat(
                                        token_data.get(data[0]) as string
                                    ) + parseFloat(data[1] as string)
                                }`
                            );
                        } else {
                            token_data.set(data[0], data[1]);
                        }
                    });
                }
            }
    
            let keys = Array.from(token_data.keys());
            for (let i = 0; i < token_data.size; i++) {
                assetMap.set(keys[i].metadata.name ?? "N/A", {
                    balance: token_data.get(keys[i]),
                    value: 0, //Cheap does not check for cost
                    change: 0,
                    percentage: "0%",
                    address: keys[i].contract_address
                });
            }
            
            return assetMap;
        }
    
        return null;
}

export async function get_wallet_data(user : FirestoreUser | null, alchemy : Alchemy, wallets : WalletType[] | null) : Promise<Map<string, asset> | null>
{
    if (user && wallets) 
    {
        let wallet_data: Map<string, [Token, string][]> = new Map();
        let token_data: Map<Token, string> = new Map();

        const assetMap = new Map<string, asset>();

        if (wallets) 
            {
            for (let i = 0; i < wallets.length; i++) {
                let tokens = await ALCgetTokens(alchemy, wallets[i].address);
                wallet_data.set(wallets[i].address, tokens);

                //Get the total for this token's amount
                tokens.forEach((data: [Token, string]) => {
                    if (token_data.has(data[0])) {
                        token_data.set(
                            data[0],
                            `${
                                parseFloat(
                                    token_data.get(data[0]) as string
                                ) + parseFloat(data[1] as string)
                            }`
                        );
                    } else {
                        token_data.set(data[0], data[1]);
                    }
                });
            }
        }

        let keys = Array.from(token_data.keys());
        for (let i = 0; i < token_data.size; i++) {
            assetMap.set(keys[i].metadata.name ?? "N/A", {
                balance: token_data.get(keys[i]),
                value:
                    (await TokenPriceFromContract(alchemy, keys[i].contract_address)) ?? 0
                     * parseFloat(token_data.get(keys[i]) ?? "0"),
                change: 0,
                percentage: "0%",
                address: keys[i].contract_address
            });
        }
        
        return assetMap;
    }

    return null;
}