import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx?|js)$/,
      exclude: /node_modules/,
      jsxRuntime: 'automatic',
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: false,
    open: false,
    allowedHosts: ['dxc247.com'],
    hmr: {
      overlay: true,
    },
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'ui-vendor': ['bootstrap', 'react-bootstrap', 'react-toastify'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
      '@': path.resolve(__dirname, './src'),
      'crypto': 'crypto-browserify',
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /\.(js|ts|jsx|tsx)$/,
    exclude: [/node_modules/],
    jsxInject: `import React from 'react'`,
  },
  define: {
    'process.env': {},
  },
});

