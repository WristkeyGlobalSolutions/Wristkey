import { ethers } from 'ethers';

const POLYGON_RPC = 'https://rpc-mumbai.maticvigil.com';

export const provider = new ethers.JsonRpcProvider(POLYGON_RPC);

// const CONTRACT_ADDRESS = 'your_contract_address';
// const ABI = [/* contract ABI */];

// export const getSigner = () => {
// //   if (typeof window !== 'undefined' && (window as any).ethereum) {
//     // const provider = new ethers.BrowserProvider((window as any).ethereum);
//     return provider.getSigner();
//   }
//   return null;
// };

// export const getContract = async () => {
//   const signer = await getSigner();
//   if (!signer) throw new Error('No signer available');
//   return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
// };

export const connectWallet = async () => {
    // Mock a connected wallet address
    return '0x1234...abcd';
  };
  
  export const getBalance = async () => {
    return '12.5'; // Mock balance
  };
  
