"use client";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { auth, db } from "@/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { saveIncompleteUserToFirestore } from "@/lib/firestore";
import { doc, getDoc } from "firebase/firestore";
import { signInWithProvider } from "@/lib/auth";

// Define Firestore User Type
interface FirestoreUser {
	uid: string;
	name: string;
	email: string;
	age?: number;
	address?: string;
	isProfileComplete: boolean; // New field to check completion
}

// Define AuthContext Type
interface AuthContextType {
	user: FirestoreUser | null;
	loading: boolean;
	loginWithProvider: (Provider: string) => Promise<void>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<FirestoreUser | null>(null);
	const [loading, setLoading] = useState(true);

	// ✅ Fetch Firestore User Data
	const fetchUserData = async (uid: string) => {
		try {
			const userDoc = await getDoc(doc(db, "users", uid));
			if (userDoc.exists()) {
				return userDoc.data() as FirestoreUser;
			}
			return null;
		} catch (error) {
			console.error("Error fetching user data:", error);
			return null;
		}
	};

	// ✅ Google Login
	const loginWithProvider = async (Provider: string) => {
		try {
			const firebaseUser = await signInWithProvider(Provider);
			// Check if user exists in Firestore
			const firestoreUser = await fetchUserData(firebaseUser.uid);

			if (!firestoreUser) {
				// If user is new, create a Firestore entry with incomplete profile
				await saveIncompleteUserToFirestore(firebaseUser);
				console.log(
					"New user added to Firestore with incomplete profile."
				);
			}
			// Reload user data after saving to Firestore
			const updatedUser = await fetchUserData(firebaseUser.uid);
			setUser(updatedUser);
		} catch (error) {
			console.error("Google login error:", error);
		}
	};

	const refreshUser = async () => {
		if (user) {
			const updatedUser = await fetchUserData(user.uid);
			setUser(updatedUser);
		}
	};

	// ✅ Listen for Auth Changes and Load Firestore Data
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				const firestoreUser = await fetchUserData(firebaseUser.uid);
				setUser(firestoreUser);
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	// ✅ Logout
	const logout = async () => {
		await signOut(auth);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, loginWithProvider, logout, refreshUser }}
		>
			{children}
		</AuthContext.Provider>
	);
}

// ✅ Custom Hook for Using AuthContext
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
