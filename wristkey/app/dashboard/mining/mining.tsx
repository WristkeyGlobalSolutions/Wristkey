"use client";
import React, { useEffect, useState } from 'react';
import WalletNav from "@/components/UI/WalletNav";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


const Mining = () => {

 const { user, refreshUser } = useAuth();
 const router = useRouter();
    const [activeTab, setActiveTab] = useState<'portfolio' | 'explore' | 'swap' | 'favorites' | 'mining'>();
      const handleClick = (page: 'portfolio' | 'explore' | 'swap' | 'favorites' | 'mining') => {
        setActiveTab(page);
      };

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-950">
        <div className="bg-gray-100 rounded-t-3xl p-2">
            <h1 className="text-4xl text-center p-2">Mining</h1>
            <WalletNav currentTab='mining' />
        
            <div>
                <ul className=" m-4 ml-72">
				    <li>
					    <button
						 onClick={() => [router.push("/dashboard/mining/managewallets"), handleClick('portfolio')]}
						 className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 ${activeTab === 'portfolio' ? 'bg-gray-100' : ''}`}
					    >
						    Manage Wallets
					    </button>
				    </li>
				    <li>
					    <button
						 onClick={() => [router.push("/dashboard/mining"), handleClick('explore')]}
						 className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 border-b-2 border-gray-300 ${activeTab === 'explore' ? 'bg-gray-100' : ''}`}
					    >
						    Mining
					    </button>
				    </li>
				    <li>
					    <button 
						 onClick={() => [router.push("/dashboard/mining/security"), handleClick('swap')]}
						 className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 ${activeTab === 'swap' ? 'bg-gray-100' : ''}`}
						>
						    Security
					    </button>
				    </li>
				    <li>
					    <button 
						 onClick={() => [router.push("/dashboard/mining/appearance"), handleClick('favorites')]}
						 className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 ${activeTab === 'favorites' ? 'bg-gray-100' : ''}`}
						>
						    Appearance
					    </button>
				    </li>
				    <li>
					    <button 
						 onClick={() => [router.push("/dashboard/mining/preferences"), handleClick('mining')]}
						 className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 ${activeTab === 'mining' ? 'bg-gray-100' : ''}`}
						>
						    Preferences
					    </button>
				    </li>
                    <li>
					    <button 
						 onClick={() => [router.push("/dashboard/mining/notifications"), handleClick('mining')]}
						 className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 ${activeTab === 'mining' ? 'bg-gray-100' : ''}`}
						>
						    Notifications
					    </button>
				    </li>
                    <li>
					    <button 
						 onClick={() => [router.push("/dashboard/mining/privacy"), handleClick('mining')]}
						 className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 ${activeTab === 'mining' ? 'bg-gray-100' : ''}`}
						>
						    Privacy
					    </button>
				    </li>
                    <li>
					    <button 
						 onClick={() => [router.push("/dashboard/mining/support"), handleClick('mining')]}
						 className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 ${activeTab === 'mining' ? 'bg-gray-100' : ''}`}
						>
						    Support
					    </button>
				    </li>
                    <li>
					    <button 
						 onClick={() => [router.push("/dashboard/mining/about"), handleClick('mining')]}
						 className={`hover:bg-gray-300 min-w-full text-left text-xl py-4 px-4 transition duration-200 ${activeTab === 'mining' ? 'bg-gray-100' : ''}`}
						>
						    About
					    </button>
				    </li>
			    </ul>
            </div>
        </div>
    </div>
  ); // end return
};

export default Mining;