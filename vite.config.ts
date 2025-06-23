import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');
  const dropConsole = env.VITE_DROP_CONSOLE === 'true';
  const port = env.VITE_APP_PORT ? Number(env.VITE_APP_PORT) : 3000; 

  return {
    plugins: [react()],
    server: {
      port, 
      open: true,
      cors: true,
    },
    resolve: {
      alias: {
        '@': '/src',
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    esbuild: {
      drop: dropConsole ? ['console', 'debugger'] : [],
    },
  }
})
