import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/main.jsx'],
      reporter: ['text', 'html', 'cobertura', 'lcov'],
      reportsDirectory: './coverage',
      // Piso minimo: la cobertura no puede bajar de aqui. Subelo a medida que agregues pruebas.
      thresholds: { lines: 10, statements: 12, functions: 15, branches: 5 },
    },
  },
})
