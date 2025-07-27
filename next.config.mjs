/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose",
  },
  webpack: (config, { isServer }) => {
    // Handle Firebase compatibility
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Handle ES modules and Leaflet
    config.externals = [...(config.externals || []), "canvas", "jsdom"];

    // Handle Leaflet specifically
    // REMOVED THE PROBLEMATIC CSS RULE HERE
    // config.module.rules.push({
    //   test: /\.css$/,
    // });

    return config;
  },
  transpilePackages: ["leaflet"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
