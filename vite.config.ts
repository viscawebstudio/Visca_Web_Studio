import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          const envUrl = process.env.VITE_SITE_URL || '';
          const siteUrl = envUrl.includes('vercel.app') ? 'https://viscawebstudio.com' : envUrl;
          return html.replace(/__SITE_URL__/g, siteUrl);
        }
      }
    ],
    envPrefix: ['VITE_', 'EMAILJS_'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide')) return 'lucide';
              if (id.includes('react-router') || id.includes('@remix-run')) return 'react-router';
              if (id.includes('react') || id.includes('scheduler')) return 'react-vendor';
              if (id.includes('gsap')) return 'gsap';
              if (id.includes('swiper')) return 'swiper';
              if (id.includes('html2canvas') || id.includes('dompurify')) return 'html2canvas';
              if (id.includes('jspdf')) return 'jspdf';
              if (id.includes('@emailjs')) return 'emailjs';
              if (id.includes('motion') || id.includes('framer-motion')) return 'motion';
              return 'vendor'; // all other node_modules
            }
          }
        }
      }
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
