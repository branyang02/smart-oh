import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

dotenv.config({ path: ".env.test" });

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: "node",
        setupFiles: ["./src/__test__/setup.ts"]
    }
});
