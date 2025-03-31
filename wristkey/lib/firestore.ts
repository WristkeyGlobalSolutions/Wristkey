// lib/firestore.ts
import { db } from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { AuthUser } from "./auth";

// Store user data in Firestore
export const saveUserToFirestore = async (user: AuthUser, name: string, address: string, age: number): Promise<void> => {
	try {
		await setDoc(doc(db, "users", user.uid), {
			uid: user.uid,
			name: name,
			email: user.email,
			address: address,
			age: Number(age),
			isProfileComplete: true,
			createdAt: new Date(),
		});
		console.log("User successfully added to Firestore.");
	} catch (error) {
		console.error("Error writing user to Firestore:", error);
	}
};

export const updateUserInFirestore = async (user: AuthUser, updates: Partial<AuthUser>): Promise<void> => {
	try {
		await setDoc(doc(db, "users", user.uid), updates, { merge: true });
		console.log("User successfully updated in Firestore.");
	} catch (error) {
		console.error("Error updating user in Firestore:", error);
	}
}

export const saveIncompleteUserToFirestore = async (user: AuthUser): Promise<void> => {
	try {
		await setDoc(doc(db, "users", user.uid), {
			uid: user.uid,
			email: user.email,
			createdAt: new Date(),
			isProfileComplete: false, // Mark as incomplete
		});
		console.log("User successfully added to Firestore with incomplete profile.");
	} catch (error) {
		console.error("Error writing incomplete user to Firestore:", error);
	}
}
