"use client";

import React from 'react';
import { useAuth } from '@/app/context/AuthContext'; // Adjust the path as needed
import { useRouter } from 'next/navigation';

const NavBar: React.FC = () => {
	const { user, logout } = useAuth();
	const router = useRouter();

	return (
		<nav className="bg-blue-600 text-white p-4 shadow-md">
			<div className="container mx-auto flex justify-between items-center">
				<button
					onClick={() => router.push('/')}
					className="text-2xl font-bold bg-transparent border-none cursor-pointer"
				>
					Wristkey
				</button>
				<div>
					{user ? (
						<div className="flex items-center space-x-4">
							<span className="text-lg">Welcome, {user.name}</span>
							<button
								onClick={() => {
									logout();
									router.push('/auth');
								}}
								className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
							>
								Logout
							</button>
						</div>
					) : (
						<div className="flex space-x-4">
							<button
								onClick={() => router.push('/auth')}
								className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
							>
								Login
							</button>
							<button
								onClick={() => router.push('/auth')}
								className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
							>
								Register
							</button>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default NavBar;