"use client";
import { useAuth } from "../context/AuthContext";
import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteProfile() {
	const { user, refreshUser } = useAuth();
	const router = useRouter();
	const [name, setName] = useState(user?.name || "");
	const [age, setAge] = useState<number>(0);
	const [address, setAddress] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		try {
			await updateDoc(doc(db, "users", user.uid), {
				name,
				age: Number(age),
				address,
				isProfileComplete: true, // ✅ Mark as complete
			});

			await refreshUser();

			router.push("/dashboard"); // ✅ Redirect to dashboard after completing profile
		} catch (error) {
			console.error("Error updating profile:", error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
			>
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">
						Name:
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">
						Age:
					</label>
					<input
						type="number"
						value={age}
						onChange={(e) =>
							setAge(e.target.value as unknown as number)
						}
						required
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">
						Address:
					</label>
					<input
						type="text"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						required
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
				>
					Save Profile
				</button>
			</form>
		</div>
	);
}
