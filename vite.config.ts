import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

const page = (name: string) => fileURLToPath(new URL(name, import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: page("index.html"),
        about: page("about.html"),
        services: page("service.html"),
        ventures: page("ventures.html"),
        partnership: page("partnership.html"),
        faq: page("faq.html"),
        contact: page("contact.html"),
        privacy: page("privacy.html")
      }
    }
  }
});
