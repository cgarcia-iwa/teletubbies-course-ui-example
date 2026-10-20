import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    // Evidencia: traza completa del flujo, descargable desde el reporte HTML.
    trace: 'on',
    screenshot: 'only-on-failure'
  },
  // Levanta el frontend si no está corriendo. El backend (:8080) debe estar arriba.
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: true
  }
});
