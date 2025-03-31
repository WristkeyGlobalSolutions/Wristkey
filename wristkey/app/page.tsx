"use client";


export default function Home() {
	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<header className="bg-gray-800 py-4">
				<div className="container mx-auto text-center">
					<h1 className="text-4xl font-bold">Welcome to CryptoHub</h1>
					<p className="text-lg mt-2">Your gateway to cryptocurrency insights</p>
				</div>
			</header>

			<main className="container mx-auto py-8 px-4">
				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">Cryptocurrency Stats</h2>
					<p>Bitcoin: $27,000</p>
					<p>Ethereum: $1,800</p>
					<p>Dogecoin: $0.07</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">About Cryptocurrency</h2>
					<p>
						Cryptocurrency is a digital or virtual currency that uses
						cryptography for security. It operates independently of a central
						authority, making it decentralized and secure.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">Why Crypto?</h2>
					<p>
						Cryptocurrencies offer a new way to transact, invest, and store
						value. They are fast, secure, and borderless, making them a
						revolutionary financial tool.
					</p>
				</section>

				<div className="text-center mt-8">
					<a
						href="/auth"
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
					>
						Go to Auth Page
					</a>
				</div>
			</main>

			<footer className="bg-gray-800 py-4 mt-8">
				<div className="container mx-auto text-center">
					<p>&copy; 2023 CryptoHub. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
