import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./app/i18n.middleware.ts');

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
