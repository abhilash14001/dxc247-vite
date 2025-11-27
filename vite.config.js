import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: '**/*.{jsx,js}',
    })
  ],
  publicDir: path.resolve(__dirname, '../../public'),
  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: false,
    open: false,
    allowedHosts: ['dxc247.com'],
    hmr: {
      overlay: true,
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false, // Disable source maps for production (matching CRA behavior)
    minify: 'esbuild', // Use esbuild for minification (faster, good obfuscation)
    // Remove console and debugger in production builds
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'ui-vendor': ['bootstrap', 'react-bootstrap', 'react-toastify'],
        },
        compact: true, // Compact output
        // Obfuscate file names - use hash only, hide component names
        chunkFileNames: 'assets/chunk-[hash].js',
        entryFileNames: 'assets/entry-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
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
    include: /src\/.*\.js$/,
    exclude: [],
  },
  define: {
    'process.env': {},
  },
});
