import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix webpack chunk loading issues in production
  experimental: {
    esmExternals: 'loose'
  },
  
  // Optimize for Vercel deployment
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize client-side chunk loading
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            default: false,
            vendors: false,
            // Create a vendor chunk for better caching
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
            },
            // Create a common chunk for shared components
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig; 