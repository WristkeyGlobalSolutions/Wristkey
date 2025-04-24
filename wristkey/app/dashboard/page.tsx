"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { addWalletToUser } from "@/lib/firestore"; // Adjust the import path as necessary

export default function Dashboard() {
	const { user, logout, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (!user) {
				router.push("/auth");
			} else if (!user.isProfileComplete) {
				router.push("/complete-profile"); // ✅ Redirect if profile is incomplete
			}
		}
	}, [user, loading, router]);

	if (loading) return <p>Loading...</p>;
	if (!user) return null;

	const testwallet = async () => {
		const wallet = "testwalletSecond"; // Replace with your wallet address
		try {
			await addWalletToUser(user, wallet);
			console.log("Wallet successfully added to user in Firestore.");
		} catch (error) {
			console.error("Error adding wallet to user:", error);
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
				<p className="text-gray-600 mb-4">Welcome, <span className="font-medium text-gray-800">{user.name}</span>!</p>
				<div className="mb-4">
					<p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
					<p className="text-gray-600"><strong>Age:</strong> {user.age}</p>
					<p className="text-gray-600"><strong>Address:</strong> {user.address}</p>
					<p className="text-gray-600"><strong>Profile Complete:</strong> {user.isProfileComplete ? "Yes" : "No"}</p>
				</div>
				<button
					onClick={() => router.push("/dashboard/coins")}
					className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200 mb-4"
				>
					Go to Coins
				</button>
				<button
					onClick={logout}
					className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-200"
				>
					Logout
				</button>

				<button onClick={testwallet}>Test wallet</button>
			</div>
		</div>
	);
}
