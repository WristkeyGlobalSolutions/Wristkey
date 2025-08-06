import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "About | Hybrid Crypto Wallet",
	description:
		"Learn more about the Hybrid Crypto Wallet project: its vision, technology, and future impact.",
};

export default function AboutPage() {
	return (
		<div className=" text-white bg-gradient-to-b from-blue-950 to-black min-h-screen">
			<div className="max-w-5xl mx-auto p-6">
				<h1 className="text-4xl font-bold mb-6">
					About Wristkey - Hybrid Crypto Wallet
				</h1>

				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Our Vision</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							The Hybrid Crypto Wallet is designed to bridge the
							gap between security and usability in blockchain
							asset management. By combining hot wallet
							accessibility with cold wallet protection, we aim to
							redefine how users interact with decentralized
							finance (DeFi), staking, and on-chain transactions.
						</p>
					</CardContent>
				</Card>

				<Card className="mb-8">
					<CardHeader>
						<CardTitle>What Makes It Hybrid?</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground">
							<li>
								<strong>Hot Layer:</strong> Real-time
								transaction management, staking, and airdrop
								participation.
							</li>
							<li>
								<strong>Cold Layer:</strong> Secure offline
								storage and signing for high-value operations.
							</li>
							<li>
								<strong>Split Key Architecture:</strong>{" "}
								Sensitive data is encrypted and partially stored
								in hot and cold environments for maximum
								security.
							</li>
						</ul>
					</CardContent>
				</Card>

				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Technology Stack</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground">
							<li>
								<strong>Frontend:</strong> Next.js, TypeScript,
								TailwindCSS, and shadcn/ui components
							</li>
							<li>
								<strong>Backend:</strong> AWS Lambda, DynamoDB,
								Secrets Manager, and API Gateway
							</li>
							<li>
								<strong>Blockchain:</strong> Polygon Network
								using ethers.js for smart contract interaction
							</li>
							<li>
								<strong>Security:</strong> Two-Factor
								Authentication (TOTP), multi-signature
								authorization, AES-256 encryption
							</li>
							<li>
								<strong>Privacy:</strong> Zero-Knowledge Proofs
								(Plonky3) for transaction validation
							</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Impact and Future Directions</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							Our project addresses the critical need for a wallet
							that balances trustless blockchain accessibility
							with robust cybersecurity practices. As the crypto
							landscape evolves, we plan to integrate biometric
							authentication, advanced analytics through
							Snowflake, and hardware-based cold wallet support
							for institutional-grade use cases.
						</p>
					</CardContent>
				</Card>

				<Separator className="my-10" />
			</div>
		</div>
	);
}
