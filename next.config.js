/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            enforce: true,
            priority: 1,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: 2,
            enforce: true,
          },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig