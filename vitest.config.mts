import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' });

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: 'node',
        setupFiles: ['./src/__test__/setup.ts'],
    },
})