import path from "node:path";
import { defineConfig } from "vite";
import toml from "rstoml";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: "toml",
      transform(code: string, id: string) {
        if (id.endsWith("toml")) {
          return {
            code: `
              const data = ${JSON.stringify(toml.parse(code))};
              export default data;
          `,
          };
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
