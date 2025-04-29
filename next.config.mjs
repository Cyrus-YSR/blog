/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/photo-1441974231531-c6227db76b6e*',
            },
        ]
    },
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev','172.23.0.1'],
    transpilePackages: ['framer-motion'],
    reactStrictMode: true,
    output: 'export',
    // swcMinify: true,
};



export default nextConfig;
