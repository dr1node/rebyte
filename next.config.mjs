import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

const nextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });
    if (isServer) {
      config.resolve.alias['@huggingface/transformers$'] = path.join(path.dirname(require.resolve('@huggingface/transformers')), 'transformers.web.js');
    }
    config.resolve.alias['onnxruntime-web$'] = path.join(path.dirname(require.resolve('onnxruntime-web')), 'ort.min.js');
    return config;
  },
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
