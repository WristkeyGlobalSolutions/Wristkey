import { useAuth } from "@/context/AuthContext";
import {
	removeWalletFromUser,
	updateWalletInUser,
	Wallet,
} from "@/lib/firestore";
import React from "react";

interface WalletCardProps {
	wallet: Wallet;
	active: boolean;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet, active }) => {
	const { user } = useAuth();
	const [walletState, setWalletState] = React.useState<Wallet>(wallet);
	const [renameBox, setRenameBox] = React.useState(false);
	const [newName, setNewName] = React.useState<string>(wallet.name || "");

	if (!user) {
		return <div>Please log in to view your wallets.</div>;
	}

	const handleSetMainWallet = async () => {
		try {
			const updatedMainState = !walletState.main;
			setWalletState((prevState) => ({
				...prevState,
				main: updatedMainState,
			}));
			await updateWalletInUser(user, {
				...wallet,
				main: updatedMainState,
			});
		} catch (error) {
			console.error("Error toggling main wallet:", error);
		}
	};

	const handleDeleteWallet = async () => {
		try {
			await removeWalletFromUser(user, wallet.address);
			window.location.reload(); // Reload the page to reflect changes
		} catch (error) {
			console.error("Error deleting wallet:", error);
		}
	};

	const handleRenameClick = () => {
		const prevstate = renameBox;
		setRenameBox(!renameBox);
		if (prevstate) {
			setWalletState((prevState) => ({
				...prevState,
				name: newName,
			}));
			updateWalletInUser(user, {
				...wallet,
				name: newName,
			});
		}
	};

	return (
		<div>
			<div>
				{renameBox ? (
					<input
						type="text"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						className="border border-gray-300 rounded-lg p-2 ml-20 mt-4"
					/>
				) : (
					<p className="text-left text-lg font-semibold ml-20">
						{walletState.name}
					</p>
				)}
				<p className="text-left text-sm text-gray-500 ml-20">
					{walletState.address}
				</p>
			</div>
			{active && (
				<div>
					<div className="relative flex gap-6 mb-2 ml-20 mt-4">
						<button
							className={`rounded-xl p-2 text-sm ${
								walletState.main
									? "bg-blue-500 text-white"
									: "bg-gray-200 hover:bg-gray-300"
							}`}
							onClick={handleSetMainWallet}
						>
							Main Wallet
						</button>
						<button className="bg-gray-200 hover:bg-gray-300 rounded-xl p-2 text-sm">
							Recovery Phrase
						</button>
						<button
							className="bg-gray-200 hover:bg-gray-300 rounded-xl p-2 text-sm"
							onClick={handleRenameClick}
						>
							Rename
						</button>
						<button
							className="bg-gray-200 hover:bg-gray-300 rounded-xl p-2 text-sm"
							onClick={handleDeleteWallet}
						>
							Delete
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default WalletCard;
