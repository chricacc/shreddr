
import { AlphaTabWebPackPlugin } from '@coderline/alphatab/webpack'

const nextConfig = {
  /* config options here */
  webpack(config) {
    config.plugins.push(
      new AlphaTabWebPackPlugin({
        assetOutputDir: 'public/alphatab'
      })
    );
    return config;
  },
};

export default nextConfig;


