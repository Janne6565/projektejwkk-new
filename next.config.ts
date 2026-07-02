import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // A lockfile exists in a parent directory; pin the trace root to this
  // project so `standalone` output copies the right files for Docker.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
