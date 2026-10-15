import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiServerlessPlugin(): Plugin {
  return {
    name: 'api-serverless-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const parsedUrl = new URL(req.url, 'http://localhost');
        const endpoint = parsedUrl.pathname.replace(/^\/api\//, '').split('/')[0].replace(/\.ts$/, '');

        try {
          const modulePath = path.resolve(__dirname, 'api', `${endpoint}.ts`);
          const handlerModule = await server.ssrLoadModule(modulePath);

          if (handlerModule && typeof handlerModule.default === 'function') {
            (req as any).query = Object.fromEntries(parsedUrl.searchParams.entries());
            await handlerModule.default(req, res);
            return;
          }
        } catch (err: any) {
          console.error(`Error in /api/${endpoint}:`, err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Serverless execution error', details: err?.message }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerlessPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

