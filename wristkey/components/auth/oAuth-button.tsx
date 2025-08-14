import React from "react";

interface OAuthButtonProps {
	provider: string;
	onClick: () => void;
	message: string
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ provider, onClick, message }) => {
	const logoSrc = `/logos/${provider}.png`;

	return (
		<button
			onClick={onClick}
			className="w-full flex items-center justify-center px-4 py-2 border rounded-md bg-background hover:bg-accent text-foreground"
		>
			<img
				src={logoSrc}
				alt={`${provider} logo`}
				className="w-5 h-5 mr-3"
			/>
			<span>
				{message} with{" "}
				{provider.charAt(0).toUpperCase() + provider.slice(1)}
			</span>
		</button>
	);
};

export default OAuthButton;
