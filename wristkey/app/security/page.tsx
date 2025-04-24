"use client";
import { useState, useEffect } from 'react';

export default function SecuritySettings() {
  const [totpEnabled, setTotpEnabled] = useState<boolean>(false);

  useEffect(() => {
    const savedStatus = localStorage.getItem('2fa');
    if (savedStatus) setTotpEnabled(savedStatus === 'true');
  }, []);

  const toggle2FA = () => {
    const newStatus = !totpEnabled;
    localStorage.setItem('2fa', String(newStatus));
    setTotpEnabled(newStatus);
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Security Settings</h2>
      <p className="text-gray-600 mt-2">
        Two-Factor Authentication: <span className="font-bold">{totpEnabled ? 'Enabled' : 'Disabled'}</span>
      </p>
      <button
        onClick={toggle2FA}
        className={`mt-3 px-4 py-2 rounded ${
          totpEnabled ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}
      >
        {totpEnabled ? 'Disable' : 'Enable'} 2FA
      </button>
    </div>
  );
}
