"use client";


export default function Home() {
	return (
		<div className="bg-gradient-to-b from-blue-950 to-black">
		<div className="min-h-screen rounded-xl  text-white">
			<header className="py-40">
				<div className="container mx-auto text-center font-bold">
					<h1 className="text-6xl">HipHop Crypto Wallet</h1>
					<p className="text-4xl mt-2">Your gateway to cryptocurrency</p>
				</div>
			</header>

			<main className="container mx-auto py-8 px-4">
				<section className="mb-8 columns-2 gap-8 flex items-center">
					<h2 className="text-2xl mb-4">
					<img 
						src="/wristkey4.jpeg"
						alt="wristkey4"
						className="box-content size-96 px-20 py-20"
					/>
					</h2>
					<p className="font-semibold text-2xl text-center">All The Crypto You Need Within Reach</p>
				</section>

				<section className="mb-8 columns-2 gap-8 flex items-center">
					<h2 className="text-2xl font-semibold mb-4 text-center">Easy Access: All Day, Every Day</h2>
					<img 
						src="/wristkey1.jpeg"
						alt="wristkey4"
						className="box-content size-96 px-20 py-20 right-0"
					/>
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

			<footer className="py-4 mt-8">
				<div className="container mx-auto text-center">
					<p>&copy; 2023 CryptoHub. All rights reserved.</p>
				</div>
			</footer>
		</div>
		</div>
	);
}
