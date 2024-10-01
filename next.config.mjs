/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.telegram.org'], // Добавляем домен api.telegram.org
  },
};

export default nextConfig;
