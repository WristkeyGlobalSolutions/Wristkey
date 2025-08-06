import React, { useState, useEffect, useCallback } from 'react';
import { 
  Wallet, 
  Send, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Copy, 
  ExternalLink, 
  AlertTriangle,
  Shield,
  TrendingUp,
  Activity,
  DollarSign,
  Users,
  Star,
  Settings,
  Download,
  Upload
} from 'lucide-react';

// Enhanced Solana Web3.js functionality with better error handling
const createEnhancedSolanaWeb3 = () => {
  const LAMPORTS_PER_SOL = 1000000000;
  
  const generateKeypair = () => {
    const secretKey = new Uint8Array(64);
    crypto.getRandomValues(secretKey);
    
    // Generate a more realistic public key for demo
    const publicKeyBytes = new Uint8Array(32);
    crypto.getRandomValues(publicKeyBytes);
    const publicKeyBase58 = btoa(String.fromCharCode(...publicKeyBytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .substring(0, 44);
    
    return {
      publicKey: { 
        toString: () => publicKeyBase58,
        toBase58: () => publicKeyBase58
      },
      secretKey: secretKey
    };
  };

  const Connection = class {
    constructor(endpoint) {
      this.endpoint = endpoint;
      this.isConnected = true;
    }

    async getBalance(publicKey) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Return a more realistic balance
      const baseBalance = Math.floor(Math.random() * 5000000000); // 0-5 SOL
      return baseBalance;
    }

    async getConfirmedSignaturesForAddress2(publicKey, options = {}) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const limit = options.limit || 10;
      const signatures = [];
      
      for (let i = 0; i < Math.min(limit, 20); i++) {
        signatures.push({
          signature: this.generateSignature(),
          slot: 250000000 + i * 100,
          blockTime: Date.now() / 1000 - i * 3600 - Math.random() * 86400,
          confirmationStatus: 'finalized',
          err: Math.random() > 0.95 ? { InstructionError: [0, 'Custom'] } : null
        });
      }
      
      return signatures;
    }

    async getParsedConfirmedTransaction(signature) {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const fee = 5000 + Math.floor(Math.random() * 5000);
      const preBalance = Math.floor(Math.random() * 10000000000);
      const postBalance = preBalance - Math.floor(Math.random() * 1000000000);
      
      return {
        meta: {
          fee,
          preBalances: [preBalance, Math.floor(Math.random() * 5000000000)],
          postBalances: [postBalance, Math.floor(Math.random() * 5000000000)],
          err: Math.random() > 0.9 ? { InstructionError: [0, 'Custom'] } : null,
          logMessages: [
            'Program 11111111111111111111111111111111 invoke [1]',
            'Program 11111111111111111111111111111111 success'
          ]
        },
        transaction: {
          message: {
            accountKeys: [
              { pubkey: publicKey?.toString() || this.generateAddress() },
              { pubkey: this.generateAddress() }
            ],
            instructions: [{
              programId: '11111111111111111111111111111111',
              accounts: [0, 1],
              data: 'SGVsbG8gV29ybGQ='
            }]
          },
          signatures: [signature]
        },
        blockTime: Date.now() / 1000 - Math.random() * 86400
      };
    }

    async sendTransaction(transaction, signers) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate occasional failures
      if (Math.random() < 0.05) {
        throw new Error('Transaction simulation failed');
      }
      
      return this.generateSignature();
    }

    async requestAirdrop(publicKey, lamports) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      return this.generateSignature();
    }

    generateSignature() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let signature = '';
      for (let i = 0; i < 88; i++) {
        signature += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return signature;
    }

    generateAddress() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let address = '';
      for (let i = 0; i < 44; i++) {
        address += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return address;
    }
  };

  const SystemProgram = {
    transfer: ({ fromPubkey, toPubkey, lamports }) => ({
      keys: [
        { pubkey: fromPubkey, isSigner: true, isWritable: true },
        { pubkey: toPubkey, isSigner: false, isWritable: true }
      ],
      programId: '11111111111111111111111111111111',
      data: new Uint8Array([2, 0, 0, 0, ...new Uint8Array(8)])
    })
  };

  const Transaction = class {
    constructor() {
      this.instructions = [];
      this.feePayer = null;
      this.recentBlockhash = null;
    }

    add(instruction) {
      this.instructions.push(instruction);
      return this;
    }

    sign(...signers) {
      this.signers = signers;
    }
  };

  const PublicKey = class {
    constructor(key) {
      this.key = key;
    }

    toString() {
      return this.key;
    }

    toBase58() {
      return this.key;
    }

    static isOnCurve(key) {
      return typeof key === 'string' && key.length >= 32 && key.length <= 44;
    }
  };

  return {
    Keypair: { generate: generateKeypair },
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    LAMPORTS_PER_SOL
  };
};

const EnhancedSolanaWallet = () => {
  // Enhanced state management
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('wallet');
  const [connection, setConnection] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [analyzedTransactions, setAnalyzedTransactions] = useState({});
  const [favoriteWallets, setFavoriteWallets] = useState([]);
  const [walletName, setWalletName] = useState('');
  const [showWalletSettings, setShowWalletSettings] = useState(false);

  const solanaWeb3 = createEnhancedSolanaWeb3();

  // Enhanced initialization
  useEffect(() => {
    const conn = new solanaWeb3.Connection('https://api.testnet.solana.com');
    setConnection(conn);

    // Load saved data from sessionStorage
    const savedWallet = sessionStorage.getItem('wristkey_solana_wallet');
    const savedFavorites = sessionStorage.getItem('wristkey_favorite_wallets');
    
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        const keypair = {
          publicKey: { 
            toString: () => walletData.publicKey,
            toBase58: () => walletData.publicKey
          },
          secretKey: new Uint8Array(walletData.secretKey)
        };
        setWallet(keypair);
        setWalletName(walletData.name || 'My Wallet');
      } catch (error) {
        console.error('Error loading wallet:', error);
        showNotification('Error loading saved wallet', 'error');
      }
    }

    if (savedFavorites) {
      try {
        setFavoriteWallets(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Enhanced balance and transaction fetching
  useEffect(() => {
    if (wallet && connection) {
      fetchBalance();
      fetchTransactionHistory();
    }
  }, [wallet, connection]);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: 'info' }), 5000);
  }, []);

  const generateWallet = async () => {
    setLoading(true);
    try {
      const keypair = solanaWeb3.Keypair.generate();
      setWallet(keypair);
      setWalletName('My Wallet');
      
      // Save to sessionStorage with enhanced data
      const walletData = {
        publicKey: keypair.publicKey.toString(),
        secretKey: Array.from(keypair.secretKey),
        name: 'My Wallet',
        createdAt: new Date().toISOString()
      };
      sessionStorage.setItem('wristkey_solana_wallet', JSON.stringify(walletData));
      
      showNotification('New wallet generated successfully! 🎉', 'success');
    } catch (error) {
      showNotification('Error generating wallet: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    if (!wallet || !connection) return;
    
    setLoading(true);
    try {
      const balanceLamports = await connection.getBalance(wallet.publicKey);
      setBalance(balanceLamports / solanaWeb3.LAMPORTS_PER_SOL);
    } catch (error) {
      showNotification('Error fetching balance: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionHistory = async () => {
    if (!wallet || !connection) return;

    try {
      const signatures = await connection.getConfirmedSignaturesForAddress2(
        wallet.publicKey, 
        { limit: 15 }
      );
      
      const transactionDetails = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const transaction = await connection.getParsedConfirmedTransaction(sig.signature);
            return {
              signature: sig.signature,
              slot: sig.slot,
              blockTime: sig.blockTime,
              transaction,
              status: sig.err ? 'failed' : 'success'
            };
          } catch (error) {
            return null;
          }
        })
      );
      
      setTransactions(transactionDetails.filter(Boolean));
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  };

  const sendSOL = async () => {
    if (!wallet || !connection || !recipientAddress || !sendAmount) {
      showNotification('Please fill in all fields', 'warning');
      return;
    }

    if (!solanaWeb3.PublicKey.isOnCurve(recipientAddress)) {
      showNotification('Invalid recipient address format', 'error');
      return;
    }

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }

    if (amount > balance) {
      showNotification('Insufficient balance', 'error');
      return;
    }

    setLoading(true);
    try {
      const recipientPubkey = new solanaWeb3.PublicKey(recipientAddress);
      const lamports = amount * solanaWeb3.LAMPORTS_PER_SOL;

      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPubkey,
          lamports
        })
      );

      const signature = await connection.sendTransaction(transaction, [wallet]);
      showNotification(`Transaction sent successfully! 🚀\nSignature: ${signature.slice(0, 8)}...`, 'success');
      
      // Reset form
      setRecipientAddress('');
      setSendAmount('');
      
      // Refresh data
      setTimeout(() => {
        fetchBalance();
        fetchTransactionHistory();
      }, 2000);
      
    } catch (error) {
      showNotification('Transaction failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const requestAirdrop = async () => {
    if (!wallet || !connection) return;
    
    setLoading(true);
    try {
      await connection.requestAirdrop(wallet.publicKey, 2 * solanaWeb3.LAMPORTS_PER_SOL);
      showNotification('Airdrop requested! 💰 It may take a few minutes to arrive.', 'success');
      
      // Refresh balance after delay
      setTimeout(() => {
        fetchBalance();
      }, 5000);
    } catch (error) {
      showNotification('Airdrop failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard! 📋', 'success');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showNotification('Copied to clipboard! 📋', 'success');
    }
  };

  // Enhanced copy trading analysis
  const searchWalletTransactions = async () => {
    if (!searchAddress || !connection) {
      showNotification('Please enter a valid wallet address', 'warning');
      return;
    }

    if (!solanaWeb3.PublicKey.isOnCurve(searchAddress)) {
      showNotification('Invalid wallet address format', 'error');
      return;
    }

    setSearchLoading(true);
    try {
      const publicKey = new solanaWeb3.PublicKey(searchAddress);
      const signatures = await connection.getConfirmedSignaturesForAddress2(
        publicKey, 
        { limit: 100 }
      );
      
      const transactionDetails = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const transaction = await connection.getParsedConfirmedTransaction(sig.signature);
            return {
              signature: sig.signature,
              slot: sig.slot,
              blockTime: sig.blockTime,
              transaction,
              type: analyzeTransactionType(transaction),
              solAmount: calculateSOLAmount(transaction),
              profit: calculateProfit(transaction),
              tokens: extractTokenInfo(transaction),
              success: !sig.err
            };
          } catch (error) {
            return null;
          }
        })
      );

      const validTransactions = transactionDetails.filter(Boolean);
      setSearchResults(validTransactions);
      
      const analysis = analyzeForCopyTrading(validTransactions);
      setAnalyzedTransactions(analysis);
      
      showNotification(`Found ${validTransactions.length} transactions for analysis 📊`, 'success');
      
    } catch (error) {
      showNotification('Error analyzing wallet: ' + error.message, 'error');
    } finally {
      setSearchLoading(false);
    }
  };

  // Enhanced analysis functions
  const analyzeTransactionType = (transaction) => {
    if (!transaction?.transaction?.message?.instructions) return 'Unknown';
    
    const types = [
      'Token Swap', 'NFT Purchase', 'DeFi Stake', 'Liquidity Pool', 
      'Transfer', 'Program Interaction', 'Yield Farm', 'Governance Vote'
    ];
    return types[Math.floor(Math.random() * types.length)];
  };

  const calculateSOLAmount = (transaction) => {
    if (!transaction?.meta) return 0;
    const preBalance = transaction.meta.preBalances[0] || 0;
    const postBalance = transaction.meta.postBalances[0] || 0;
    return Math.abs(preBalance - postBalance) / solanaWeb3.LAMPORTS_PER_SOL;
  };

  const calculateProfit = (transaction) => {
    const baseProfit = (Math.random() - 0.3) * 15; // Slightly positive bias
    return Math.round(baseProfit * 100) / 100;
  };

  const extractTokenInfo = (transaction) => {
    const tokens = ['USDC', 'RAY', 'SRM', 'ORCA', 'MNGO', 'SOL', 'STEP', 'COPE', 'FIDA'];
    return {
      symbol: tokens[Math.floor(Math.random() * tokens.length)],
      amount: Math.round(Math.random() * 10000 * 100) / 100
    };
  };

  const analyzeForCopyTrading = (transactions) => {
    if (!transactions.length) return {};
    
    const successfulTxs = transactions.filter(tx => tx.success && tx.profit > 0);
    const totalProfit = transactions.reduce((sum, tx) => sum + tx.profit, 0);
    const avgTransactionSize = transactions.reduce((sum, tx) => sum + tx.solAmount, 0) / transactions.length;
    
    const tokenCounts = {};
    transactions.forEach(tx => {
      const token = tx.tokens.symbol;
      tokenCounts[token] = (tokenCounts[token] || 0) + 1;
    });

    return {
      totalTransactions: transactions.length,
      profitableTransactions: successfulTxs.length,
      totalProfit: Math.round(totalProfit * 100) / 100,
      averageTransactionSize: Math.round(avgTransactionSize * 1000) / 1000,
      successRate: Math.round((successfulTxs.length / transactions.length) * 100 * 10) / 10,
      mostTradedTokens: tokenCounts,
      riskScore: calculateRiskScore(transactions),
      consistency: calculateConsistency(transactions)
    };
  };

  const calculateRiskScore = (transactions) => {
    const avgProfit = transactions.reduce((sum, tx) => sum + Math.abs(tx.profit), 0) / transactions.length;
    return Math.min(Math.round(avgProfit * 10), 100);
  };

  const calculateConsistency = (transactions) => {
    const profits = transactions.map(tx => tx.profit);
    const avg = profits.reduce((sum, p) => sum + p, 0) / profits.length;
    const variance = profits.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / profits.length;
    return Math.max(0, Math.min(100, Math.round((1 - Math.sqrt(variance) / 10) * 100)));
  };

  // Utility functions
  const formatSOL = (lamports) => {
    if (typeof lamports === 'number') {
      return (lamports / solanaWeb3.LAMPORTS_PER_SOL).toFixed(6);
    }
    return lamports?.toFixed(6) || '0.000000';
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const addToFavorites = (address) => {
    const newFavorite = {
      address,
      name: `Wallet ${favoriteWallets.length + 1}`,
      addedAt: new Date().toISOString()
    };
    
    const updatedFavorites = [...favoriteWallets, newFavorite];
    setFavoriteWallets(updatedFavorites);
    sessionStorage.setItem('wristkey_favorite_wallets', JSON.stringify(updatedFavorites));
    showNotification('Added to favorites! ⭐', 'success');
  };

  const removeFromFavorites = (address) => {
    const updatedFavorites = favoriteWallets.filter(fav => fav.address !== address);
    setFavoriteWallets(updatedFavorites);
    sessionStorage.setItem('wristkey_favorite_wallets', JSON.stringify(updatedFavorites));
    showNotification('Removed from favorites', 'info');
  };

  const updateWalletName = () => {
    if (!wallet || !walletName.trim()) return;
    
    const savedWallet = JSON.parse(sessionStorage.getItem('wristkey_solana_wallet') || '{}');
    savedWallet.name = walletName.trim();
    sessionStorage.setItem('wristkey_solana_wallet', JSON.stringify(savedWallet));
    showNotification('Wallet name updated! 📝', 'success');
    setShowWalletSettings(false);
  };

  // Enhanced notification component
  const NotificationBanner = () => {
    if (!notification.message) return null;

    const bgColor = {
      success: 'bg-green-500/20 border-green-500/50 text-green-300',
      error: 'bg-red-500/20 border-red-500/50 text-red-300',
      warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
      info: 'bg-blue-500/20 border-blue-500/50 text-blue-300'
    }[notification.type];

    return (
      <div className={`${bgColor} border rounded-lg p-4 mb-6 text-center transition-all duration-300`}>
        <p className="whitespace-pre-line">{notification.message}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-500/20 p-3 rounded-full mr-4">
              <Wallet className="w-8 h-8 text-purple-300" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">WristKey Solana Wallet</h1>
              <p className="text-purple-300">Enhanced Testnet Demo</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 max-w-md mx-auto">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-300 text-sm font-medium">Testnet Only – Never use with real funds</p>
          </div>
        </div>

        <NotificationBanner />

        {/* Enhanced Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
          {/* Enhanced Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-5 border-b border-white/20">
            {[
              { id: 'wallet', label: 'Wallet', icon: Wallet },
              { id: 'send', label: 'Send SOL', icon: Send },
              { id: 'history', label: 'History', icon: Activity },
              { id: 'trading', label: 'Copy Trading', icon: TrendingUp },
              { id: 'favorites', label: 'Favorites', icon: Star }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-4 font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === id 
                    ? 'bg-purple-500/30 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Wallet Tab - Enhanced */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                {!wallet ? (
                  <div className="text-center py-12">
                    <div className="bg-purple-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Wallet className="w-10 h-10 text-purple-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Create Your Wallet</h3>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                      Generate a new Solana wallet to start exploring the testnet
                    </p>
                    <button
                      onClick={generateWallet}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 flex items-center mx-auto space-x-2 shadow-lg"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
                      <span>{loading ? 'Generating...' : 'Generate New Wallet'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Enhanced Balance Display */}
                    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-8 text-center border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-300 text-lg font-medium">{walletName}</h3>
                        <button
                          onClick={() => setShowWalletSettings(!showWalletSettings)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {showWalletSettings && (
                        <div className="mb-6 p-4 bg-white/5 rounded-lg">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={walletName}
                              onChange={(e) => setWalletName(e.target.value)}
                              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                              placeholder="Wallet name"
                            />
                            <button
                              onClick={updateWalletName}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <DollarSign className="w-6 h-6 text-yellow-400" />
                        <p className="text-5xl font-bold text-white">{balance.toFixed(6)}</p>
                        <span className="text-2xl text-purple-300 font-medium">SOL</span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-6">
                        ≈ ${(balance * 23.45).toFixed(2)} USD
                      </p>
                      
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={fetchBalance}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg"
                        >
                          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                          <span>Refresh</span>
                        </button>
                        <button
                          onClick={requestAirdrop}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg"
                        >
                          <Download className="w-4 h-4" />
                          <span>Airdrop</span>
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Wallet Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Public Address
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={wallet.publicKey.toString()}
                              readOnly
                              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-purple-500 focus:outline-none"
                            />
                            <button
                              onClick={() => copyToClipboard(wallet.publicKey.toString())}
                              className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors shadow-lg"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Private Key (Keep Secret!)
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type={showPrivateKey ? 'text' : 'password'}
                              value={Array.from(wallet.secretKey).join(',')}
                              readOnly
                              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-purple-500 focus:outline-none"
                            />
                            <button
                              onClick={() => setShowPrivateKey(!showPrivateKey)}
                              className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors"
                            >
                              {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h4 className="text-white font-medium mb-4 flex items-center">
                          <Activity className="w-4 h-4 mr-2" />
                          Quick Actions
                        </h4>
                        <div className="space-y-3">
                          <button
                            onClick={() => setActiveTab('send')}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                          >
                            <Send className="w-4 h-4" />
                            <span>Send SOL</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('trading')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                          >
                            <TrendingUp className="w-4 h-4" />
                            <span>Analyze Wallets</span>
                          </button>
                          <button
                            onClick={generateWallet}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Generate New</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Send Tab - Enhanced */}
            {activeTab === 'send' && (
              <div className="space-y-6">
                {!wallet ? (
                  <div className="text-center py-12">
                    <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">Please generate a wallet first</p>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">Send SOL</h3>
                      <p className="text-gray-300">Transfer SOL to another wallet</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Recipient Address
                        </label>
                        <input
                          type="text"
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          placeholder="Enter Solana address..."
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Amount (SOL)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            placeholder="0.00"
                            step="0.000001"
                            min="0"
                            max={balance}
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors pr-20"
                          />
                          <button
                            onClick={() => setSendAmount(balance.toString())}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors"
                          >
                            MAX
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          Available: {balance.toFixed(6)} SOL
                        </p>
                      </div>

                      {/* Transaction Preview */}
                      {sendAmount && recipientAddress && (
                        <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                          <h4 className="text-white font-medium mb-3">Transaction Preview</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Amount:</span>
                              <span className="text-white">{sendAmount} SOL</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Network Fee:</span>
                              <span className="text-white">~0.000005 SOL</span>
                            </div>
                            <div className="flex justify-between border-t border-white/20 pt-2">
                              <span className="text-gray-400 font-medium">Total:</span>
                              <span className="text-white font-medium">
                                {(parseFloat(sendAmount || '0') + 0.000005).toFixed(6)} SOL
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={sendSOL}
                        disabled={loading || !recipientAddress || !sendAmount}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                      >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        <span>{loading ? 'Sending...' : 'Send SOL'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Transaction History Tab - Enhanced */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                {!wallet ? (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">Please generate a wallet first</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        <Activity className="w-6 h-6 mr-2" />
                        Transaction History
                      </h3>
                      <button
                        onClick={fetchTransactionHistory}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </button>
                    </div>
                    
                    {transactions.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="bg-gray-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Activity className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-300 mb-4">No transactions found</p>
                        <p className="text-gray-400 text-sm">
                          Send some SOL or request an airdrop to see transactions here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {transactions.map((tx, index) => (
                          <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-6 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  tx.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                                }`} />
                                <div>
                                  <p className="font-mono text-white text-sm font-medium">
                                    {formatAddress(tx.signature)}
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    {formatDate(tx.blockTime)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => copyToClipboard(tx.signature)}
                                  className="text-gray-400 hover:text-white transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <a
                                  href={`https://explorer.solana.com/tx/${tx.signature}?cluster=testnet`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Status:</span>
                                <p className={`font-medium ${
                                  tx.status === 'success' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {tx.status === 'success' ? 'Success' : 'Failed'}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400">Slot:</span>
                                <p className="text-white font-medium">{tx.slot?.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Fee:</span>
                                <p className="text-white font-medium">
                                  {formatSOL(tx.transaction?.meta?.fee || 0)} SOL
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400">Type:</span>
                                <p className="text-white font-medium">Transfer</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Copy Trading Tab - Enhanced */}
            {activeTab === 'trading' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 mr-2" />
                    Copy Trading Analytics
                  </h3>
                  <p className="text-gray-300">Analyze any Solana wallet's trading performance</p>
                </div>

                {/* Enhanced Search Bar */}
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      placeholder="Enter wallet address to analyze..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={searchWalletTransactions}
                      disabled={searchLoading || !searchAddress}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg"
                    >
                      {searchLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                      <span>{searchLoading ? 'Analyzing...' : 'Analyze'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Search Examples */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Demo Addresses to Try:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'BpMgN7kJh9qGhBVaGnxF5mXqEpDkzVzYZnBqR8j6XYZW',
                      'FqMgN7kJh9qGhBVaGnxF5mXqEpDkzVzYZnBqR8j6ABCD',
                      'HpMgN7kJh9qGhBVaGnxF5mXqEpDkzVzYZnBqR8j6EFGH'
                    ].map((address) => (
                      <button
                        key={address}
                        onClick={() => setSearchAddress(address)}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                      >
                        <span>{formatAddress(address)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enhanced Analysis Results */}
                {analyzedTransactions.totalTransactions > 0 && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-500/20 rounded-lg p-6 text-center border border-blue-500/30">
                        <Activity className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                        <h4 className="text-blue-300 text-sm font-medium">Total Transactions</h4>
                        <p className="text-3xl font-bold text-white">{analyzedTransactions.totalTransactions}</p>
                      </div>
                      <div className="bg-green-500/20 rounded-lg p-6 text-center border border-green-500/30">
                        <TrendingUp className="w-8 h-8 text-green-300 mx-auto mb-2" />
                        <h4 className="text-green-300 text-sm font-medium">Success Rate</h4>
                        <p className="text-3xl font-bold text-white">{analyzedTransactions.successRate}%</p>
                      </div>
                      <div className="bg-purple-500/20 rounded-lg p-6 text-center border border-purple-500/30">
                        <DollarSign className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                        <h4 className="text-purple-300 text-sm font-medium">Total P&L</h4>
                        <p className={`text-3xl font-bold ${
                          analyzedTransactions.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {analyzedTransactions.totalProfit >= 0 ? '+' : ''}{analyzedTransactions.totalProfit} SOL
                        </p>
                      </div>
                      <div className="bg-yellow-500/20 rounded-lg p-6 text-center border border-yellow-500/30">
                        <Activity className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                        <h4 className="text-yellow-300 text-sm font-medium">Avg Size</h4>
                        <p className="text-3xl font-bold text-white">{analyzedTransactions.averageTransactionSize} SOL</p>
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h4 className="text-white font-medium mb-4">Risk Assessment</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Risk Score:</span>
                            <span className={`font-medium ${
                              analyzedTransactions.riskScore < 30 ? 'text-green-400' :
                              analyzedTransactions.riskScore < 70 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {analyzedTransactions.riskScore}/100
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Consistency:</span>
                            <span className="text-white font-medium">{analyzedTransactions.consistency}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Profitable Trades:</span>
                            <span className="text-green-400 font-medium">
                              {analyzedTransactions.profitableTransactions}/{analyzedTransactions.totalTransactions}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h4 className="text-white font-medium mb-4">Most Traded Tokens</h4>
                        <div className="space-y-2">
                          {Object.entries(analyzedTransactions.mostTradedTokens)
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 5)
                            .map(([token, count]) => (
                              <div key={token} className="flex justify-between items-center">
                                <span className="text-gray-400">{token}:</span>
                                <span className="text-white font-medium">{count} trades</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Transaction Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-medium">Recent Trading Activity</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => addToFavorites(searchAddress)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                        >
                          <Star className="w-4 h-4" />
                          <span>Add to Favorites</span>
                        </button>
                        <div className="text-sm text-gray-300">
                          Showing {searchResults.length} transactions
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {searchResults.slice(0, 10).map((tx, index) => (
                        <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                tx.success ? 'bg-green-400' : 'bg-red-400'
                              }`} />
                              <div>
                                <span className="font-mono text-white text-sm">{formatAddress(tx.signature)}</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  tx.type === 'Token Swap' ? 'bg-blue-500/20 text-blue-300' :
                                  tx.type === 'NFT Purchase' ? 'bg-purple-500/20 text-purple-300' :
                                  tx.type === 'DeFi Stake' ? 'bg-green-500/20 text-green-300' :
                                  'bg-gray-500/20 text-gray-300'
                                }`}>
                                  {tx.type}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${tx.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {tx.profit >= 0 ? '+' : ''}{tx.profit} SOL
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Amount:</span>
                              <p className="text-white font-medium">{tx.solAmount.toFixed(4)} SOL</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Token:</span>
                              <p className="text-white font-medium">{tx.tokens.symbol}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Token Amount:</span>
                              <p className="text-white font-medium">{tx.tokens.amount.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Time:</span>
                              <p className="text-white font-medium">{formatDate(tx.blockTime)}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => copyToClipboard(tx.signature)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <span className="text-gray-400 text-xs">Slot: {tx.slot?.toLocaleString()}</span>
                            </div>
                            <a
                              href={`https://explorer.solana.com/tx/${tx.signature}?cluster=testnet`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                            >
                              <span className="text-xs">Explorer</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results State */}
                {searchResults.length === 0 && searchAddress && !searchLoading && (
                  <div className="text-center py-8">
                    <div className="bg-gray-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-300 mb-2">No transactions found for this address</p>
                    <p className="text-gray-400 text-sm">Make sure the address is valid and has transaction history</p>
                  </div>
                )}

                {/* Default State */}
                {searchResults.length === 0 && !searchAddress && (
                  <div className="text-center py-12">
                    <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <TrendingUp className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Analyze Trading Performance</h3>
                    <p className="text-gray-300 mb-6 max-w-md mx-auto">
                      Enter a wallet address to analyze trading patterns and performance metrics
                    </p>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>• View success rates and profitability</p>
                      <p>• Analyze transaction patterns</p>
                      <p>• Identify profitable trading strategies</p>
                      <p>• Track token performance</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab - New */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
                    <Star className="w-6 h-6 mr-2" />
                    Favorite Wallets
                  </h3>
                  <p className="text-gray-300">Your saved wallets for quick analysis</p>
                </div>

                {favoriteWallets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-yellow-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Star className="w-10 h-10 text-yellow-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">No Favorites Yet</h3>
                    <p className="text-gray-300 mb-6">
                      Add wallets to your favorites for quick access and analysis
                    </p>
                    <button
                      onClick={() => setActiveTab('trading')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Analyze Wallets
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteWallets.map((favorite, index) => (
                      <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-6 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-white font-medium">{favorite.name}</h4>
                            <p className="text-gray-400 text-sm font-mono">{formatAddress(favorite.address)}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              Added {new Date(favorite.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromFavorites(favorite.address)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSearchAddress(favorite.address);
                              setActiveTab('trading');
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                          >
                            <TrendingUp className="w-4 h-4" />
                            <span>Analyze</span>
                          </button>
                          <button
                            onClick={() => copyToClipboard(favorite.address)}
                            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-8 space-y-2">
          <div className="flex items-center justify-center space-x-4 text-gray-400 text-sm">
            <span className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </span>
            <span className="flex items-center space-x-1">
              <Activity className="w-4 h-4" />
              <span>Testnet</span>
            </span>
            <span className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Open Source</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 WristKey Global Solutions • Built with ❤️ for the Solana ecosystem
          </p>
          <p className="text-gray-500 text-xs">
            Always verify transactions and never share your private keys
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSolanaWallet;