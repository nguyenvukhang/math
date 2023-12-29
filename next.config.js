const { rmSync, writeFileSync } = require('fs')

const PCJ = 'postcss.config.js'

writeFileSync(PCJ, 'module.exports={plugins:{tailwindcss:{},autoprefixer:{}}}')
process.on('exit', () => rmSync(PCJ, { force: true }))

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
