/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: '.next', // Replace 'build' with your desired directory name
    webpack: (config, { isServer }) => {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
            layers: true,
        };
        return config;
    },
};

module.exports = nextConfig;
