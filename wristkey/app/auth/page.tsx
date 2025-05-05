"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
	getAuth,
	getMultiFactorResolver,
	MultiFactorError,
	MultiFactorResolver,
} from "firebase/auth";
import TotpSignIn from "@/components/auth/totp-signin";
import { Button } from "@/components/UI/button";
import OAuthButton from "@/components/auth/oAuth-button";

export default function Register() {
	const {
		user,
		loading,
		signInWithEmail,
		refreshUser,
		loginWithProvider,
		signUpWithEmail,
	} = useAuth();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const router = useRouter();
	const [isTOTP, setIsTOTP] = useState<boolean>(false);
	const [resolver, setResolver] = useState<MultiFactorResolver | null>(null);

	const handleRegister = async () => {
		setError(null);

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		if (email.length < 5 || password.length < 6) {
			setError("Email must be valid & password at least 6 characters.");
			return;
		}

		try {
			await signUpWithEmail(email, password);
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
				handleTOTPSignIn(err);
			} else {
				setError("An unexpected error occurred.");
			}
		}
	};

	const [activeTab, setActiveTab] = useState<"register" | "login" | "totp">(
		"register"
	);

	const handleLogin = async () => {
		setError(null);
		if (email.length < 5 || password.length < 6) {
			setError("Email must be valid & password at least 6 characters.");
			return;
		}

		try {
			await signInWithEmail(email, password);
			router.replace("/dashboard"); // Redirect after login
			alert("Login successful!");
		} catch (err: unknown) {
			if (err instanceof Error) {
				handleTOTPSignIn(err);
			} else {
				setError("An unexpected error occurred.");
			}
		}
	};

	const handleTOTPSignIn = async (error: unknown) => {
		// 1. Verify it's the expected MFA error
		try {
			const auth = getAuth();
			const mfaResolver = getMultiFactorResolver(
				auth,
				error as MultiFactorError
			);

			setIsTOTP(true);
			setActiveTab("totp");
			setResolver(mfaResolver);

			return mfaResolver;
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred.");
			}
		}
	};

	useEffect(() => {
		if (!loading) {
			if (user && !user.isProfileComplete) {
				router.push("/complete-profile"); // ✅ Redirect if profile is incomplete
			} else if (user) {
				router.push("/dashboard"); // ✅ Redirect if user is not logged in
			}
		}
	}, [user, loading, router]);

	if (loading) return <p>Loading...</p>;
	if (user) return null;

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background">
			<div className="w-full max-w-md p-8 bg-card rounded-lg shadow-md">
				<div className="flex justify-center mb-6">
					<Button
						variant={activeTab === "register" ? "default" : "ghost"}
						onClick={() => setActiveTab("register")}
					>
						Register
					</Button>
					<Button
						variant={activeTab === "login" ? "default" : "ghost"}
						onClick={() => setActiveTab("login")}
					>
						Login
					</Button>
					{isTOTP && (
						<Button
							variant={activeTab === "totp" ? "default" : "ghost"}
							onClick={() => setActiveTab("totp")}
						>
							TOTP
						</Button>
					)}
				</div>
				{error && (
					<p className="mb-4 text-sm text-destructive">{error}</p>
				)}
				{activeTab === "register" ? (
					<div className="space-y-4">
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
						/>
						<input
							type="password"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
						/>
						<Button className="w-full" onClick={handleRegister}>
							Sign Up
						</Button>
						<OAuthButton
							provider="google"
							onClick={() => handleProviderSignIn("Google")}
							message="Sign up"
						/>
						<OAuthButton
							provider="github"
							onClick={() => handleProviderSignIn("GitHub")}
							message="Sign up"
						/>
					</div>
				) : activeTab === "login" ? (
					<div className="space-y-4">
						{/* Login inputs */}
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
						/>
						<Button className="w-full" onClick={handleLogin}>
							Log In
						</Button>
						<OAuthButton
							provider="google"
							onClick={() => handleProviderSignIn("Google")}
							message="Log in"
						/>
						<OAuthButton
							provider="github"
							onClick={() => handleProviderSignIn("GitHub")}
							message="Log in"
						/>
					</div>
				) : (
					<div className="space-y-4">
						<TotpSignIn resolver={resolver!} />
					</div>
				)}
			</div>
		</div>
	);
}
