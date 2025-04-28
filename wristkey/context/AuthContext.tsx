"use client";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { auth, db } from "@/firebaseConfig";
import {
	MultiFactorError,
	onAuthStateChanged,
	signOut,
	User,
} from "firebase/auth";
import { saveIncompleteUserToFirestore } from "@/lib/firestore";
import { doc, getDoc } from "firebase/firestore";
import { signInWithProvider, signIn, signUp } from "@/lib/auth";

// Define Firestore User Type
export interface FirestoreUser {
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
	fireBaseUser: User | null; // Firebase user object
	loading: boolean;
	loginWithProvider: (Provider: string) => Promise<void>;
	signInWithEmail: (email: string, password: string) => Promise<void>;
	signUpWithEmail: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<FirestoreUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [fireBaseUser, setFireBaseUser] = useState<User | null>(null);

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

	const signInWithEmail = async (
		email: string,
		password: string
	): Promise<void> => {
		try {
			const firebaseUser = await signIn(email, password);
			const firestoreUser = await fetchUserData(firebaseUser.uid);
			if (!firestoreUser) {
				// If user is new, create a Firestore entry with incomplete profile
				await saveIncompleteUserToFirestore(firebaseUser);
				console.log(
					"New user added to Firestore with incomplete profile."
				);
			}
			setFireBaseUser(firebaseUser); // Set Firebase user object
			// Reload user data after saving to Firestore
			const updatedUser = await fetchUserData(firebaseUser.uid);
			setUser(updatedUser);
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			} else {
				throw new Error("An unknown error occurred during sign-in.");
			}
		}
	};

	const signUpWithEmail = async (
		email: string,
		password: string
	): Promise<void> => {
		try {
			const firebaseUser = await signUp(email, password);
			const firestoreUser = await fetchUserData(firebaseUser.uid);
			if (!firestoreUser) {
				// If user is new, create a Firestore entry with incomplete profile
				await saveIncompleteUserToFirestore(firebaseUser);
				console.log(
					"New user added to Firestore with incomplete profile."
				);
			}
			setFireBaseUser(firebaseUser); // Set Firebase user object
			// Reload user data after saving to Firestore
			const updatedUser = await fetchUserData(firebaseUser.uid);
			setUser(updatedUser);
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			} else {
				throw new Error("An unknown error occurred during sign-in.");
			}
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
			setFireBaseUser(firebaseUser); // Set Firebase user object
			// Reload user data after saving to Firestore
			const updatedUser = await fetchUserData(firebaseUser.uid);
			setUser(updatedUser);
		} catch (error) {
			if (
				(error as MultiFactorError).code ===
				"auth/multi-factor-auth-required"
			) {
				throw error;
			}
			if (error instanceof Error) {
				throw new Error(error.message);
			} else {
				throw new Error(
					"An unknown error occurred during Google sign-in."
				);
			}
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
				setFireBaseUser(firebaseUser); // Set Firebase user object
				setUser(firestoreUser);
			} else {
				setUser(null);
				setFireBaseUser(null); // Reset Firebase user object
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
			value={{
				user,
				loading,
				loginWithProvider,
				logout,
				refreshUser,
				fireBaseUser,
				signInWithEmail,
				signUpWithEmail,
			}}
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
