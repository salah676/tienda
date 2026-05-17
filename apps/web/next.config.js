/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@debt-manager/db', '@debt-manager/types', '@debt-manager/utils'],
}

module.exports = nextConfig