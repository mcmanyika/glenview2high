const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/glenview2-b3d45.appspot.com/o/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/ai-assistant',
        destination: 'https://shoolschatapi.pythonanywhere.com/api/',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/ai-assistant',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};
