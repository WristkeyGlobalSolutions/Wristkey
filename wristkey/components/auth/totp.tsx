import React from "react";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";

interface TOTPInputProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	error: string | null;
}

const TOTPInput: React.FC<TOTPInputProps> = ({
	value,
	onChange,
	onSubmit,
	error,
}) => {
	const handleChange = (otpValue: string) => {
		onChange(otpValue);
	};

	return (
		<div className="w-full flex flex-col items-center justify-center space-y-2">
			<InputOTP
				maxLength={6}
				onChange={handleChange}
				value={value}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						onSubmit();
					}
				}}
			>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
				</InputOTPGroup>
				<InputOTPSeparator />
				<InputOTPGroup>
					<InputOTPSlot index={3} />
					<InputOTPSlot index={4} />
					<InputOTPSlot index={5} />
				</InputOTPGroup>
			</InputOTP>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};

export default TOTPInput;
