import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // На GitHub Pages сайт живёт в подпапке /gudini/, локально — в корне.
  base: command === 'build' ? '/gudini/' : '/',
}))
