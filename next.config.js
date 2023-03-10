/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CURRENT_BASE_URL: process.env.CURRENT_BASE_URL,
    PUSHER_KEY: process.env.PUSHER_KEY,
    PUSHER_CLUSTER: process.env.PUSHER_CLUSTER
  },
}

module.exports = nextConfig
