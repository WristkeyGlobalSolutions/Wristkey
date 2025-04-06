"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust the path as needed
import { useRouter, usePathname } from "next/navigation";
import Dropdown from "./Dropdown";

const NavBar: React.FC = () => {
	const { user, logout } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const location = pathname == "/";

	return (
		<nav className="bg-gray-900 text-white p-4 shadow-md">
			<div className="container mx-auto flex justify-between items-center">
				<button
					onClick={() => router.push("/")}
					className="text-2xl font-bold bg-transparent border-none cursor-pointer flex items-center space-x-2"
				>
					<img
						src="/wristkey.jpeg"
						alt="Wristkey"
						className="w-20 h-20 px-4 py-4"
					/>
					Wristkey
				</button>

				<div className="transparent">
					<div className="flex justify-between align-text-bottom">
						<button
							onClick={() => router.push("/")}
							className="text-white align-text-bottom text-xl py-2 px-4"
						>
							About Crypto
						</button>
						<button
							onClick={() => router.push("/")}
							className="text-white text-center text-xl py-2 px-4"
						>
							Watch
						</button>
						<span>
							<Dropdown />
						</span>
					</div>
				</div>

				<div>
					{user ? (
						<div className="flex items-center space-x-4">
							<span className="text-lg">
								Welcome, {user.name}
							</span>
							<button
								onClick={() => {
									logout();
									router.push("/auth");
								}}
								className="transparent hover:text-gray-400 text-white px-4 py-2 rounded"
							>
								Logout
							</button>
						</div>
					) : (
						<div className="flex space-x-4">
							<button
								onClick={() => router.push("/auth")}
								className="transparent hover:text-gray-400 text-xl text-white px-4 py-2 rounded"
							>
								Login
							</button>
							<button
								onClick={() => router.push("/auth")}
								className="transparent hover:text-gray-400 text-xl text-white px-4 py-2 rounded"
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
