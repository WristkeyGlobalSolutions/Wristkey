import { Alchemy, Network, AlchemySettings } from 'alchemy-sdk';
import { ethers } from 'ethers';

// Types
export interface SwapParams {
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  fromAddress: string;
  slippagePercentage?: number;
}

interface SwapQuoteResult {
    toTokenAmount: string;
    fromTokenAmount: string;
    estimatedGas: string;
    route: any;
    tx: {
        to: string;
        data: string;
        value: string;
        gasLimit: string;
    };
}

const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
const provider = new ethers.JsonRpcProvider((await alchemy.config.getProvider()).connection.url);

export async function getAlchemySwapQuote(
params: SwapParams
): Promise<SwapQuoteResult> 
{
    try {
        const {
        fromTokenAddress,
        toTokenAddress,
        amount,
        fromAddress,
        slippagePercentage = 1 // Default 1% slippage
        } = params;
        
        // Get the swap quote through Alchemy's API
        // Note: This uses the Alchemy Core API request method
        const quoteResponse = await alchemy.core.send("alchemy_getTokenSwapQuote", 
        [{
            fromTokenAddress,
            toTokenAddress,
            amount,
            fromAddress,
            slippagePercentage: slippagePercentage.toString(),
            gasLimit: "500000", // Optional gas limit
            maxFeePerGas: "50000000000", // Optional max fee per gas (50 gwei)
            maxPriorityFeePerGas: "1500000000" // Optional max priority fee (1.5 gwei)
        }]);
        
        // Format the response into our expected structure
        return{
        toTokenAmount: quoteResponse.toTokenAmount,
        fromTokenAmount: quoteResponse.fromTokenAmount,
        estimatedGas: quoteResponse.estimatedGas,
        route: quoteResponse.route,
        tx: {
            to: quoteResponse.tx.to,
            data: quoteResponse.tx.data,
            value: quoteResponse.tx.value,
            gasLimit: quoteResponse.tx.gasLimit
        }
        };
    } 
    catch (error) 
    {
        console.error("Error getting swap quote from Alchemy:", error);
        throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
    }
}

export async function checkTokenAllowance(
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string,
    amount: string
  ): Promise<boolean> 
{
    try 
    {
        // ERC20 interface for allowance check
        const tokenContract = new ethers.Contract(
        tokenAddress,
        ["function allowance(address owner, address spender) view returns (uint256)"],
        provider
        );
        
        // Check current allowance
        const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
        
        // Convert amount to BigNumber for comparison
        const amountBN = ethers.toBigInt(amount);
        
        // Return true if allowance is sufficient
        return allowance >= amountBN;
    } 
    catch (error) 
    {
        console.error("Error checking token allowance:", error);
        throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
    }
}

export async function checkAllowanceViaAlchemyCore(
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string,
    amount: string
  ): Promise<boolean> 
{
    try{
        // Use Alchemy's core API to make the call directly
        const allowanceHex = await alchemy.core.call({
        to: tokenAddress,
        // Encode the allowance function call
        data: `0xdd62ed3e000000000000000000000000${ownerAddress.substring(2)}000000000000000000000000${spenderAddress.substring(2)}`
        });
        
        // Convert hex to BigNumber
        const allowance = ethers.toBigInt(allowanceHex);
        const amountBN = ethers.toBigInt(amount);
        
        return allowance >= amountBN;
    } 
    catch (error) 
    {
        console.error("Error checking allowance via Alchemy core:", error);
        throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
    }
}

// Generate approval transaction data
export function generateApprovalData(
    tokenAddress: string, 
    spenderAddress: string
    ): { to: string; data: string } 
{
    // ERC20 approval function signature
    const approvalInterface = new ethers.Interface(["function approve(address spender, uint256 amount) returns (bool)"]);

    // Create the approval data with unlimited approval amount
    const data = approvalInterface.encodeFunctionData(
        "approve", 
        [spenderAddress, ethers.MaxUint256]
    );

    return{
        to: tokenAddress,
        data
    };
}

export async function executeAlchemySwap(
    params: SwapParams
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> 
{
    try 
    {
        // Get the quote first
        const quote = await getAlchemySwapQuote(params);
        
        // For frontend execution, connect to the user's wallet
        if (typeof window === 'undefined' || !window.ethereum) 
        {
            throw new Error("No ethereum provider found. Please install MetaMask or another wallet.");
        }
        
        //TODO set the wallet address
        //This gets the user's wallet address!
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        
        // Make sure we're using the connected user's address
        params.fromAddress = userAddress;
        
        // Check if approval is needed
        if (params.fromTokenAddress !== '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') 
        {
            const isApproved = await checkAllowanceViaAlchemyCore(
            params.fromTokenAddress,
            userAddress,
            quote.tx.to,
            params.amount,
            );
            
            if(!isApproved) 
            {
                console.log("Token approval needed. Sending approval transaction...");
                const approvalData = generateApprovalData(params.fromTokenAddress, quote.tx.to);
                
                const approveTx = await signer.sendTransaction({
                to: approvalData.to,
                data: approvalData.data
                });
                
                console.log("Approval transaction sent:", approveTx.hash);
                await approveTx.wait();
                console.log("Approval confirmed");
            }
        }
            
        // Execute the swap transaction
        console.log("Sending swap transaction...");
        const swapTx = await signer.sendTransaction({
        to: quote.tx.to,
        data: quote.tx.data,
        value: quote.tx.value,
        gasLimit: ethers.toBigInt(quote.tx.gasLimit) * BigInt(12/10) // Add 20% buffer
        });
        
        console.log("Swap transaction sent:", swapTx.hash);
        const receipt = await swapTx.wait();
        console.log("Swap confirmed in block:", receipt?.blockNumber);
        
        return {
        success: true,
        transactionHash: swapTx.hash
        };
    } 
    catch (error) 
    {
        console.error("Error executing swap:", error);
        return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

export async function getSwapQuoteReadOnly(
    params: SwapParams
  ): Promise<{
    quote: SwapQuoteResult;
    readableQuote: {
      fromAmount: string;
      toAmount: string;
      exchangeRate: string;
      gasCost: string;
      needsApproval: boolean;
    };
  }> 
{
    try 
    {
        // Get the quote
        const quote = await getAlchemySwapQuote(params);
        
        // Add some readable information
        const readableQuote = {
        fromAmount: quote.fromTokenAmount,
        toAmount: quote.toTokenAmount,
        exchangeRate: (Number(quote.toTokenAmount) / Number(quote.fromTokenAmount)).toFixed(6),
        gasCost: quote.estimatedGas,
        needsApproval: params.fromTokenAddress !== '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        };
        
        return {
        quote,
        readableQuote
        };
    } 
    catch(error) 
    {
        console.error("Error getting read-only swap quote:", error);
        throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
    }
}