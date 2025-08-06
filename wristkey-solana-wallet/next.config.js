/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static exports for GitHub Pages deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Configure for GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/solana-wallet-demo' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/solana-wallet-demo/' : '',
  
  // Webpack configuration for browser compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'testnet',
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.testnet.solana.com',
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react']
  }
};

module.exports = nextConfig;