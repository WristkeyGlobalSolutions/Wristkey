import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Accessories | Hybrid Crypto Wallet",
	description:
		"Learn more about wearable accessories coming soon.",
};

export default function AccessoriesPage() {

	return (
		<div className=" text-white bg-gradient-to-b from-blue-950 to-black">
			<div className="w-full p-6">
				<h1 className="text-5xl text-white text-center font-bold">
					Wristkey Global Hardware Suite
				</h1>
            </div>
            <div className="columns-2 py-32">
                <div className="flex place-content-center">
                    <video className="rounded-lg" width={600} height={600}  controls>
                        <source src="/videos/watchComingSoon.MP4" type="video/mp4" />
                        Your browser does not support video type. 
                    </video>
                    <div className="absolute w-[600px] h-[337px] pointer-events-none rounded-lg bg-radial-fade"/>
                </div>
                <div className="flex flex-col items-center justify-center h-72 w-full text-center p-2">
                    <h1 className="text-2xl text-white font-bold mb-4">Coming Soon: Wearable Tech That Pays You</h1>
                    <p className="text-lg text-white">
                        Wristkey Global is pioneering the future of digital finance 
                        with the first-ever line of wearable crypto hardware that secures, 
                        spends, and earns—all from your body.
                    </p>
                </div>
                
            </div>
            <div className="px-72 w-full py-4">
                <h1 className="flex justify-center text-5xl font-semibold">
                    Introducing Our Devices:
                </h1>
                <div className="flex justify-between gap-20">
                    <div className="my-20 w-80 h-40 bg-gray-400 rounded-xl text-center text-black font-semibold p-2">
                        <p className="text-center space-y-2 my-5">
                            Wristkey Smartring
                        </p>
                        <p>
                            A secure, NFC-enabled crypto wallet ring—sleek, minimalist, and always with you.
                        </p>
                    </div>
                    <div className="my-20 w-80 h-40 bg-gray-400 rounded-xl text-center text-black font-semibold p-2">
                        <p className="text-center space-y-2 my-5">
                            Wristkey Smartring
                        </p>
                        <p>
                            A secure, NFC-enabled crypto wallet ring—sleek, minimalist, and always with you.
                        </p>
                    </div>
                    <div className="my-20 w-80 h-40 bg-gray-400 rounded-xl text-center text-black font-semibold p-2">
                        <p className="text-center space-y-2 my-5">
                            Wristkey Smartring
                        </p>
                        <p>
                            A secure, NFC-enabled crypto wallet ring—sleek, minimalist, and always with you.
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 px-72">
                <h1 className="text-4xl text-center flex items-center justify-center font-semibold mb-8">
                    Core Concepts
                </h1>
                <ul className="list-disc list-inside text-xl space-y-2 mb-6 ml-24">
                    <li>
                        Multi-chain compatibility
                    </li>
                    <li>
                        Biometric + 2FA security
                    </li>
                    <li>
                        Income-generating mining chip
                    </li>
                    <li>
                        Real-time tracking via Wristkey App
                    </li>
                    <li>
                        Cold & soft wallet integration
                    </li>
                </ul>
            </div>
            <div className="py-28">
                <h1 className="text-center text-4xl font-semibold p-8">
                    Backed by a Global Vision
                </h1>
                <p className="text-center text-xl mx-80">
                    With partners and communities across Asia, Africa, Dubai, UK, 
                    South America, and the U.S., we’re building the decentralized 
                    financial system of tomorrow—starting today. 
                </p>
            </div>
            <div>
                <h1 className="text-center text-4xl font-semibold mb-8 px-8">
                    Join the Movement. Be First to Access.
                </h1>
                <div className="flex justify-center">
                    <a
                        className="flex place-items-center justify-center bg-blue-500 h-16 w-32 rounded-xl hover:bg-blue-600"
                        href="https://docs.google.com/forms/d/e/1FAIpQLSea7SFeEIPFtxdmq6iRUV6-ci5dVIK5zVlQJ1Em_53aU8MQLg/viewform"
                    >
                        Join Waitlist
                    </a>
                </div>
                <p className="text-center text-xl mx-80 p-8">
                    Get early access, updates & exclusive perks. 
                </p>
            </div>
		</div>
	);
}
