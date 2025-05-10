"use client";


export default function Home() {
	return (
		<div className="bg-gradient-to-b from-blue-950 to-black">
		<div className="min-h-screen rounded-xl  text-white">
			<header className="p-6">
				<div className="container mx-auto text-center font-bold">
					<h1 className="text-6xl">Wristkey Global Wallet</h1>
					<p className="text-4xl mt-2">Your gateway to cryptocurrency</p>
				</div>
			</header>

			<main className="container mx-auto">
				<section className="columns-2 flex justify-between items-center my-16 mx-16">
					<h2 className="text-2xl mb-4 flex">
						<img 
							src="/wristkey4.jpeg"
							alt="wristkey4"
							className="box-content size-[560px] rounded-xl shadow-2xl"
						/>
						<div className="flex absolute size-[560px] pointer-events-none rounded-lg bg-radial-fade"/>
					</h2>
					<p className="font-semibold text-2xl text-center bg-gfreen-300">All The Crypto You Need Within Reach</p>
				</section>

				<section className="mb-8">
					<h2 className="text-4xl text-center font-semibold mt-20">Why Crypto?</h2>
					<p className="text-2xl text-center mt-6 mx-20">
						Cryptocurrencies offer a new way to transact, invest, and store
						value. They are fast, secure, and borderless, making them a
						revolutionary financial tool.
					</p>
				</section>
{/** 
				<div className="text-center mt-8">
					<a
						href="/auth"
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
					>
						Go to Auth Page
					</a>
				</div>*/}
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
