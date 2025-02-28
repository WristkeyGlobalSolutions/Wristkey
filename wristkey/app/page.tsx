"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [wallet, setWallet] = useState<string | null>(null);

  const handleConnect = () => setWallet('0x1234...abcd');

  return (
    <div className="p-5">
      {wallet ? (
        <p className="text-green-500">Connected: {wallet}</p>
      ) : (
        <button onClick={handleConnect} className="bg-blue-500 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      )}
      <div className="mt-4">
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
