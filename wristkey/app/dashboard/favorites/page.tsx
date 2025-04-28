"use client";
import React, { useEffect, useState } from 'react';
import WalletNav from "@/components/UI/WalletNav";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


const Favorites = () => {

    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [favorites, userFavorites] = useState<null>(null);

    return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-950">
        <div className="bg-gray-100 rounded-t-3xl p-2">
            <h1 className="text-4xl text-center p-2">Favorites</h1>
            <WalletNav />
        </div>
    </div>
    )
}

export default Favorites;