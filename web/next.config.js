const { rmSync, writeFileSync } = require('fs')

writeFileSync(
  'postcss.config.js',
  'module.exports={plugins:{tailwindcss:{},autoprefixer:{}}}',
)
process.on('exit', () => rmSync('postcss.config.js', { force: true }))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    // use Preact instead of React
    if (!options.dev && !options.isServer) {
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }
    return config
  },
}

module.exports = nextConfig

