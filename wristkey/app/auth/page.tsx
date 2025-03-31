"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Register() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [name, setName] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [age, setAge] = useState<number>(0);
	const router = useRouter();
	const { refreshUser, loginWithProvider } = useAuth();

	const handleRegister = async () => {
		setError(null);
		if (email.length < 5 || password.length < 6) {
			setError("Email must be valid & password at least 6 characters.");
			return;
		}

		try {
			await signUp(email, password, name, address, age);
			router.replace("/dashboard"); // Redirect after registration
            alert("Registration successful! You can now log in.");
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred.");
			}
		}
	};

	const handleProviderSignIn = async (Provider: string) => {
		setError(null);
		try {
			await loginWithProvider(Provider);
			await refreshUser;
			router.replace("/dashboard"); // Redirect after Google sign-in
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred.");
			}
		}
	};

	const [activeTab, setActiveTab] = useState<"register" | "login">("register");

	const handleLogin = async () => {
		setError(null);
		if (email.length < 5 || password.length < 6) {
			setError("Email must be valid & password at least 6 characters.");
			return;
		}

		try {
			await signIn(email, password);
			router.replace("/dashboard"); // Redirect after login
			alert("Login successful!");
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred.");
			}
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
				<div className="flex justify-center mb-6">
					<button
						onClick={() => setActiveTab("register")}
						className={`px-4 py-2 font-bold ${
							activeTab === "register"
								? "text-blue-500 border-b-2 border-blue-500"
								: "text-gray-500"
						}`}
					>
						Register
					</button>
					<button
						onClick={() => setActiveTab("login")}
						className={`px-4 py-2 font-bold ${
							activeTab === "login"
								? "text-blue-500 border-b-2 border-blue-500"
								: "text-gray-500"
						}`}
					>
						Login
					</button>
				</div>
				{error && <p className="mb-4 text-sm text-red-500">{error}</p>}
				{activeTab === "register" ? (
					<div className="space-y-4">
						<input
							type="text"
							placeholder="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
						/>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
						/>
						<input
							type="text"
							placeholder="Address"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
						/>
						<input
							type="number"
							placeholder="Age"
							value={age}
							onChange={(e) => setAge(Number(e.target.value))}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
						/>
						<button
							onClick={handleRegister}
							className="w-full px-4 py-2 mt-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							Sign Up
						</button>
						<button
							onClick={() => handleProviderSignIn("Google")}
							className="w-full px-4 py-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
						>
							Sign Up with Google
						</button>
						<button
							onClick={() => handleProviderSignIn("GitHub")}
							className="w-full px-4 py-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
						>
							Sign Up with GitHub
						</button>
					</div>
				) : (
					<div className="space-y-4">
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
						/>
						<button
							onClick={handleLogin}
							className="w-full px-4 py-2 mt-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							Log In
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
