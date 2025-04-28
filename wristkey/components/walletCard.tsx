import { useRouter } from 'next/navigation';
import React, { useState } from "react";

interface WalletCardProps {
    name: string | undefined | null;
    recoveryPhrase? : string;
    address: string;
    privateKey? : string;
    isActive: boolean;
}

const WalletCard: React.FC<WalletCardProps> = ({
    name,
    recoveryPhrase,
    address,
    privateKey,
    isActive
}) => {
    const router = useRouter();
    return (
        <div>
            <div>
                <p className="text-left text-lg font-semibold ml-20">{name}</p>
                <p className="text-left text-sm text-gray-500 ml-20">{address}</p>
            </div>
            {isActive && (
                <div>
                    <div className="relative flex gap-6 mb-2 ml-20 mt-4">
                        <button 
                         className="bg-gray-200 hover:bg-gray-300 rounded-xl p-2 text-sm"
                        >
                            Main Wallet
                        </button>
                        <button 
                         className="bg-gray-200 hover:bg-gray-300 rounded-xl p-2 text-sm"
                        >
                            Recovery Phrase
                        </button>
                        <button 
                         className="bg-gray-200 hover:bg-gray-300 rounded-xl p-2 text-sm"
                        >
                            Rename
                        </button>
                        <button 
                         className="bg-gray-200 hover:bg-gray-300 rounded-xl p-2 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletCard;
