/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: '.next', // Replace 'build' with your desired directory name
    webpack: (config, { isServer }) => {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
            layers: true,
        };
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };
        return config;
    },
};

module.exports = nextConfig;
