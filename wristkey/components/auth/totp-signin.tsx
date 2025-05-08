import React from "react";
import Totp from "@/components/auth/totp";
import { MultiFactorResolver } from "firebase/auth";
import { signInWithTOTP } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface TotpSignInProps {
	resolver: MultiFactorResolver;
}

const TotpSignIn: React.FC<TotpSignInProps> = ({ resolver }) => {
	const enrolledFactors = resolver.hints.map((info) => info.displayName);
	const [selectedFactor, setSelectedFactor] = React.useState<number>(0);
	const [code, setCode] = React.useState<string>("");
	const router = useRouter();
	const [error, setError] = React.useState<string | null>(null);

	const handleTOTPSubmit = async () => {
		setError(null);
		if (code.length < 6) {
			setError("TOTP code must be 6 digits.");
			return;
		}
		try {
			if (resolver) {
				await signInWithTOTP(resolver, selectedFactor, code); // Assuming 0 is the index for TOTP
				router.replace("/dashboard"); // Redirect after TOTP verification
			} else {
				setError("No multi-factor resolver found.");
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred.");
			}
		}
	};

	return (
		<div>
			{enrolledFactors.length > 1 && (
				<>
					{" "}
					<label htmlFor="selectedFactor">Select Factor:</label>
					<Select
						onValueChange={(value) =>
							setSelectedFactor(enrolledFactors.indexOf(value))
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a factor" />
						</SelectTrigger>
						<SelectContent>
							{enrolledFactors.map((factor, index) => (
								<SelectItem key={index} value={factor || ""}>
									{factor}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</>
			)}
			<Totp onChange={setCode} value={code} onSubmit={handleTOTPSubmit} error={error} />
			<button
				onClick={handleTOTPSubmit}
				className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
			>
				Submit TOTP
			</button>
		</div>
	);
};

export default TotpSignIn;
