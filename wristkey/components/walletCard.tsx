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
    const dropdown = () => {
        const [open, setOpen] = useState(null);
    }
    const router = useRouter();
    return (
        <div>
            {isActive === true ? (
                <div>
                    <p className="text-left text-lg font-semibold ml-20">{name}</p>
                    <p className="text-left text-sm text-gray-500 ml-20">{address}</p>
                    <div className="relative flex justify-center mb-6">
                        <p className="absolute left-20">Main Wallet</p>
                        <p className="absolute left-48">Recovery Phrase</p>
                        <p className="absolute left-80">Rename</p>
                        <p className="absolute left-96">Delete</p>
                    </div>
                </div>
            ):(
                <div>
                    <p className="text-left text-lg font-semibold ml-20">{name}</p>
                    <p className="text-left text-sm text-gray-500 ml-20">{address}</p>
                </div>
            )}
        
        </div>
    );
};

export default WalletCard;
