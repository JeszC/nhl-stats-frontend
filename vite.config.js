import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import eslint from "vite-plugin-eslint";

export default defineConfig({
    plugins: [
        react(),
        eslint()
    ],
    build: {
        sourcemap: false
    },
    test: {
        coverage: {
            provider: "v8"
        }
    }
});
