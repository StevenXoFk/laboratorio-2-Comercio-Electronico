import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  base: '/PY1---Comercio-Electr-nico/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})