import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Dev server middleware: serves /api/visitors during local `npm run dev`
function apiDevPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url && (req.url.startsWith('/api/visitors') || req.url.startsWith('/api/visits'))) {
          try {
            const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
            if (env.UPSTASH_REDIS_REST_URL) process.env.UPSTASH_REDIS_REST_URL = env.UPSTASH_REDIS_REST_URL;
            if (env.UPSTASH_REDIS_REST_TOKEN) process.env.UPSTASH_REDIS_REST_TOKEN = env.UPSTASH_REDIS_REST_TOKEN;

            const { default: handler } = await import('./api/visits.js');

            const executeHandler = async (bodyContent: string) => {
              req.body = bodyContent;
              if (!res.status) {
                res.status = (code: number) => { res.statusCode = code; return res; };
              }
              if (!res.json) {
                res.json = (data: any) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return res;
                };
              }
              await handler(req, res);
            };

            if (req.method === 'POST' || req.method === 'PUT') {
              let body = '';
              req.on('data', (chunk: any) => { body += chunk; });
              req.on('end', async () => {
                await executeHandler(body);
              });
            } else {
              await executeHandler('');
            }
          } catch (err) {
            next(err);
          }
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    apiDevPlugin(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
