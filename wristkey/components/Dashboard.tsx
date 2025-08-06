import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [balance, setBalance] = useState<string>('0.00');
  const [rewards, setRewards] = useState<string>('0.00');

  useEffect(() => {
    setTimeout(() => {
      setBalance('12.5');
      setRewards('3.2');
    }, 1000);
  }, []);

  return (
    <div className="p-5 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Wallet Balance: {balance} MATIC</h2>
      <h3 className="text-lg text-gray-600">Staking Rewards: {rewards} MATIC</h3>
    </div>
  );
}
