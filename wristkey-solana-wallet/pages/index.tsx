import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import the wallet component to avoid SSR issues
const EnhancedSolanaWallet = dynamic(() => import('../components/EnhancedSolanaWallet'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading WristKey Solana Wallet...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <>
      <Head>
        <title>WristKey Solana Wallet - Enhanced Testnet Demo</title>
        <meta name="description" content="Advanced Solana testnet wallet with copy trading analytics, built by WristKey Global Solutions" />
        <meta name="keywords" content="solana, wallet, cryptocurrency, testnet, copy trading, blockchain, wristkey" />
        <meta name="author" content="WristKey Global Solutions" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wristkey-global.github.io/solana-wallet-demo/" />
        <meta property="og:title" content="WristKey Solana Wallet - Enhanced Testnet Demo" />
        <meta property="og:description" content="Advanced Solana testnet wallet with copy trading analytics" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://wristkey-global.github.io/solana-wallet-demo/" />
        <meta property="twitter:title" content="WristKey Solana Wallet - Enhanced Testnet Demo" />
        <meta property="twitter:description" content="Advanced Solana testnet wallet with copy trading analytics" />
        <meta property="twitter:image" content="/og-image.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://api.testnet.solana.com" />
        <link rel="preconnect" href="https://explorer.solana.com" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* PWA support */}
        <meta name="application-name" content="WristKey Solana Wallet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WristKey Solana Wallet" />
      </Head>
      
      <main>
        <EnhancedSolanaWallet />
      </main>
    </>
  );
}