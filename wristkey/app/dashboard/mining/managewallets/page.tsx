"use client";
import React, { useEffect, useState } from 'react';
import WalletNav from "@/components/UI/WalletNav";
import WalletCard from "@/components/walletCard";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


const managewallets = () => {

 const { user, refreshUser } = useAuth();
 const router = useRouter();
 const [active, setActive] = useState(false);
 const handleClick = () => {
  setActive(!active);
 };

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-950">
        <div className="bg-white rounded-t-3xl p-2">
          <div className="relative flex items-center justify-center py-2">
            <button
             onClick={() => router.push("/dashboard/mining")}
             className="absolute left-72 text-2xl"
            >
              Back
            </button>
            <h1 className="text-4xl">Manage Wallets</h1>
          </div>
            <WalletNav />
        
            <div className="ml-72 mt-8">
                <h1 className="text-black text-xl">My Wallets:</h1>
                <button
                 className="p-4 w-2/3 mt-4 border rounded-2xl shadow hover:shadow-lg"
                 onClick={handleClick}
                >
                  <WalletCard 
                   name="B-A-N-A-N-A-S"
                   address="0x1234567"
                   isActive={active}
                  />
                </button>
                <button
                 className="p-4 w-2/3 mt-4 border rounded-2xl shadow hover:shadow-lg"
                 onClick={handleClick}
                >
                  <WalletCard
                   name="wristkey"
                   address="0x098765432123345"
                   isActive={active}
                  />
               </button>
                
            </div>
        </div>
    </div>
  ); // end return
};

export default managewallets;
