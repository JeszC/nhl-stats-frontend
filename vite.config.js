import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import eslint from "vite-plugin-eslint";
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        eslint(),
        VitePWA(
            {
                registerType: "autoUpdate",
                manifest: {
                    name: "NHL Stats",
                    short_name: "NHL Stats",
                    icons: [
                        {
                            src: "images/favicon.svg",
                            sizes: "any",
                            type: "image/svg+xml",
                            purpose: "any"
                        }
                    ]
                }
            }
        )
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
