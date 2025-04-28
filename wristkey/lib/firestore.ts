// lib/firestore.ts
import { db } from "../firebaseConfig";
import { setDoc, doc, collection, getDocs } from "firebase/firestore";
import { AuthUser } from "./auth";
import { deleteDoc } from "firebase/firestore";

export interface Wallet {
	name: string | undefined | null;
	address: string;
	main: boolean;
	recoveryPhrase?: string;
}

// Store user data in Firestore
export const saveUserToFirestore = async (
	user: AuthUser,
	name: string,
	address: string,
	age: number
): Promise<void> => {
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

export const addWalletToUser = async (
	user: AuthUser,
	wallet: Wallet
): Promise<void> => {
	try {
		await setDoc(
			doc(collection(db, "users", user.uid, "wallets"), wallet.address),
			{ name: wallet.name, address: wallet.address, main: wallet.main, recoveryPhrase: wallet.recoveryPhrase || null },
		);
		console.log("Wallet successfully added to user in Firestore.");
	} catch (error) {
		console.error("Error adding wallet to user:", error);
	}
};

export const updateWalletInUser = async (
	user: AuthUser,
	wallet: Wallet
): Promise<void> => {
	try {
		await setDoc(
			doc(collection(db, "users", user.uid, "wallets"), wallet.address),
			{ name: wallet.name, address: wallet.address, main: wallet.main, recoveryPhrase: wallet.recoveryPhrase || null },
			{ merge: true }
		);
		console.log("Wallet successfully updated in user in Firestore.");
	} catch (error) {
		console.error("Error updating wallet in user:", error);
	}
}

export const removeWalletFromUser = async (
	user: AuthUser,
	wallet: string
): Promise<void> => {
	try {
		await deleteDoc(doc(collection(db, "users", user.uid, "wallets"), wallet));
		console.log("Wallet successfully removed from user in Firestore.");
	} catch (error) {
		console.error("Error removing wallet from user:", error);
	}
};

export const getWalletsFromUser = async (user: AuthUser): Promise<Wallet[]> => {
	try {
		const walletsRef = collection(db, "users", user.uid, "wallets");
		const walletsSnapshot = await getDocs(walletsRef);
		if (!walletsSnapshot.empty) {
			console.log(
				"Wallets found for user:",
				walletsSnapshot.docs.map((doc) => doc.id)
			);
			return walletsSnapshot.docs.map((doc) => doc.data() as Wallet);
		} else {
			console.log("No wallets found for user.");
			return [];
		}
	} catch (error) {
		console.error("Error fetching wallets from user:", error);
		return [];
	}
};

export const addFavoriteToUser = async (
	user: AuthUser,
	favorite: string
): Promise<void> => {
	try {
		await setDoc(
			doc(collection(db, "users", user.uid, "favorites"), favorite),
			{ favorite }
		);
		console.log("Favorite successfully added to user in Firestore.");
	} catch (error) {
		console.error("Error adding favorite to user:", error);
	}
};

export const removeFavoriteFromUser = async (
	user: AuthUser,
	favorite: string
): Promise<void> => {
	try {
		await setDoc(
			doc(collection(db, "favorite", user.uid, "favorites"), favorite),
			{ favorite },
			{ merge: true }
		);
		console.log("Favorite successfully removed from user in Firestore.");
	} catch (error) {
		console.error("Error removing favorite from user:", error);
	}
};

export const getFavoritesForUser = async (user: AuthUser): Promise<string[]> => {
	try {
		const favRef = collection(db, "users", user.uid, "favorites");
		const favSnapshot = await getDocs(favRef);
		if (!favSnapshot.empty) {
			console.log(
				"Favorites found for user:",
				favSnapshot.docs.map((doc) => doc.id)
			);
			return favSnapshot.docs.map((doc) => doc.id);
		} else {
			console.log("No favorites found for user.");
			return [];
		}
	} catch (error) {
		console.error("Error fetching favorites from user:", error);
		return [];
	}
};


export const updateUserInFirestore = async (
	user: AuthUser,
	updates: Partial<AuthUser>
): Promise<void> => {
	try {
		await setDoc(doc(db, "users", user.uid), updates, { merge: true });
		console.log("User successfully updated in Firestore.");
	} catch (error) {
		console.error("Error updating user in Firestore:", error);
	}
};

export const saveIncompleteUserToFirestore = async (
	user: AuthUser
): Promise<void> => {
	try {
		await setDoc(doc(db, "users", user.uid), {
			uid: user.uid,
			email: user.email,
			createdAt: new Date(),
			isProfileComplete: false, // Mark as incomplete
		});
		console.log(
			"User successfully added to Firestore with incomplete profile."
		);
	} catch (error) {
		console.error("Error writing incomplete user to Firestore:", error);
	}
};
