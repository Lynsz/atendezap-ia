/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    VITE_KIWI_INITIAL_CHECKOUT_URL: process.env.VITE_KIWI_INITIAL_CHECKOUT_URL,
    VITE_KIWI_PRO_CHECKOUT_URL: process.env.VITE_KIWI_PRO_CHECKOUT_URL
  }
};

export default nextConfig;
