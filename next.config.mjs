/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com', // for GOOGLE provider
            },
            {
                protocol: 'https',
                hostname: 'platform-lookaside.fbsbx.com', // for FACEBOOK provider
            },
            {
                protocol: 'https',
                hostname: 'manga-image.s3.eu-central-1.amazonaws.com', // AWS Bucket Cloud
            },
        ],
    },
};

export default withNextIntl(nextConfig);
