// lib/auth.ts
import { auth } from "../firebaseConfig";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	signInWithPopup,
	GoogleAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";
import { saveUserToFirestore } from "./firestore";

// Type definition for User object
export interface AuthUser {
	uid: string;
	email: string | null;
}

export const signUp = async (
	email: string,
	password: string,
	name: string,
	address: string,
	age: number
): Promise<AuthUser> => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		const userData: AuthUser = { uid: user.uid, email: user.email };

		await updateProfile(user, { displayName: email });
		await saveUserToFirestore(userData, name, address, age); // Save user to Firestore
		return userData;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred during sign-up.");
		}
	}
};

export const logout = async (): Promise<void> => {
	await signOut(auth);
};

export const signInWithProvider = async (providerType: string): Promise<AuthUser> => {
	let provider;
	switch (providerType) {
		case "Google":
			provider = new GoogleAuthProvider();
			break;
		case "GitHub":
			provider = new GithubAuthProvider();
			break;
		default:
			throw new Error("Unsupported provider");
	}
	try {
		const result = await signInWithPopup(auth, provider);
		const user = result.user;
		const userData: AuthUser = { uid: user.uid, email: user.email };
		return userData;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred during Google sign-in.");
		}
	}
};

export const signIn = async (
	email: string,
	password: string
): Promise<AuthUser> => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		return { uid: user.uid, email: user.email };
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred during sign-in.");
		}
	}
};
