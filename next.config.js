/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CURRENT_BASE_URL: process.env.CURRENT_BASE_URL
  },
}

module.exports = nextConfig
