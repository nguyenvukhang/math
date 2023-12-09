const { rmSync, writeFileSync, createWriteStream } = require('fs')

const LATEST_RELEASE =
  'https://github.com/nguyenvukhang/math/releases/latest/download/minimath.pdf'

rmSync('public/minimath.pdf')

fetch(LATEST_RELEASE)
  .then((v) => v.blob().then((v) => v.arrayBuffer()))
  .then((v) => createWriteStream('public/minimath.pdf').write(Buffer.from(v)))

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
