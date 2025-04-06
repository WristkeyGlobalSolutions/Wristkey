import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext'; // Adjust the path as needed
import { useRouter } from "next/navigation"

const Dropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false); // State to toggle the dropdown

  // Function to toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close the dropdown if clicked outside of it
  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Handling click outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click happened outside the dropdown, close it
      if (event.target instanceof HTMLElement && !event.target.closest('.dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative dropdown">
        <button
          onClick={toggleDropdown}
          className="text-white text-center text-xl py-2 px-4 hover:text-gray-400"
        >
          Wallet
        </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200  shadow-lg z-10">
          <ul className="py-2">
            <li>
              <a 
                href="/dashboard/portfolio"
           			onClick={() => router.push('/dashboard/portfolio')} 
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Portfolio
              </a>
            </li>
            <li>
              <a 
                href="/dashboard/coins"
           			onClick={() => router.push('/dashboard/coins')} 
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Explore
              </a>
            </li>
            <li>
              <a 
                href="/"
           			onClick={() => router.push('/')} 
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Swap
              </a>
            </li>
            <li>
             <a 
                href="/"
           			onClick={() => router.push('/')} 
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Favorites
              </a>
            </li>
            <li>
              <a 
                href="/"
           			onClick={() => router.push('/')} 
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Mining
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
