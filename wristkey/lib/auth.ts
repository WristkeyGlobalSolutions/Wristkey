// lib/auth.ts
import { auth } from "../firebaseConfig";
import {
	createUserWithEmailAndPassword,
	signOut,
	signInWithPopup,
	GoogleAuthProvider,
	GithubAuthProvider,
	multiFactor,
	PhoneAuthProvider,
	PhoneMultiFactorGenerator,
	User,
	TotpMultiFactorGenerator,
	TotpSecret,
	signInWithEmailAndPassword,
	MultiFactorResolver,
	MultiFactorError,
} from "firebase/auth";
import QRCode from "qrcode";

export const verifySMSCode = async (
	user: User,
	verificationId: string,
	verificationCode: string,
	mfaDisplayName: string
) => {
	const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
	const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

	// Complete enrollment.
	return multiFactor(user).enroll(multiFactorAssertion, mfaDisplayName);
};

export const setUpTOTP = async (user: User) => {
	if (!user) {
		throw new Error("User is not authenticated");
	}
	if (!user.email) {
		throw new Error("User email is not available");
	}
	const multiFactorSession = await multiFactor(user).getSession();
	const totpSecret = await TotpMultiFactorGenerator.generateSecret(
		multiFactorSession
	);
	const totpUri = totpSecret.generateQrCodeUrl(user.email, "Your App's Name");

	const qrCanvas = document.getElementById(
		"qr-code-canvas"
	) as HTMLCanvasElement;

	if (qrCanvas) {
		await QRCode.toCanvas(qrCanvas, totpUri);
	} else {
		throw new Error("QR code canvas element not found");
	}
	return totpSecret;
};

export const verifyTOTPCode = async (
	user: User,
	totpSecret: TotpSecret,
	totpCode: string,
	displayName: string
) => {
	const multiFactorAssertion =
		TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, totpCode);
	return multiFactor(user).enroll(multiFactorAssertion, displayName);
};

// Type definition for User object
export interface AuthUser {
	uid: string;
	email: string | null;
}

export const signUp = async (
	email: string,
	password: string
): Promise<User> => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		return user;
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

export const getEnrolledFactors = async (mfaResolver: MultiFactorResolver) => {
	const enrolledFactors = mfaResolver.hints.map((info) => info.displayName);
	console.log("Enrolled factors:", enrolledFactors);
	if (enrolledFactors[0] === undefined || enrolledFactors[0] === null) {
		throw new Error("No enrolled factors found.");
	}
	return enrolledFactors[0];
};

export const signInWithTOTP = async (
	mfaResolver: MultiFactorResolver,
	selectedIndex: number,
	otpFromAuthenticator: string
) => {
	switch (mfaResolver.hints[selectedIndex].factorId) {
		case TotpMultiFactorGenerator.FACTOR_ID:
			const multiFactorAssertion =
				TotpMultiFactorGenerator.assertionForSignIn(
					mfaResolver.hints[selectedIndex].uid,
					otpFromAuthenticator
				);
			try {
				const userCredential = await mfaResolver.resolveSignIn(
					multiFactorAssertion
				);
				return userCredential.user;
			} catch (error) {
				if (error instanceof Error) {
					throw new Error(error.message);
				} else {
					console.error("An unknown error occurred:", error);
					throw new Error("An unknown error occurred.");
				}
			}
			break;
		case PhoneMultiFactorGenerator.FACTOR_ID:
			// Handle SMS second factor.
			throw new Error(
				"Phone multi-factor authentication is not implemented."
			);
			break;
		default:
			// Unsupported second factor?
			throw new Error("Unsupported second factor.");
			break;
	}
};

export const signInWithProvider = async (
	providerType: string
): Promise<User> => {
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
		return user;
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
			console.error("An unknown error occurred:", error);
			throw new Error("An unknown error occurred.");
		}
	}
};

export const signIn = async (
	email: string,
	password: string
): Promise<User> => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		return user;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred during sign-in.");
		}
	}
};
