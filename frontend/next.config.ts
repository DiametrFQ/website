import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone'
};

export default withNextIntl(nextConfig);