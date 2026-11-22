import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

// Filesystem access is build-time only; the published app receives static URLs.
export function catalogPhotos(): Plugin {
  const id = "virtual:catalog-photos";
  const resolvedId = `\0${id}`;
  const directory = resolve("public/productos");
  function scan(folder: string, prefix = "/productos"): string[] {
    if (!existsSync(folder)) return [];
    return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
      const url = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) return scan(resolve(folder, entry.name), url);
      return entry.name.endsWith(".jpg") ? [url] : [];
    }).sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  }
  return {
    name: "catalog-photos",
    resolveId(source) { return source === id ? resolvedId : undefined; },
    load(source) { return source === resolvedId ? `export default ${JSON.stringify(scan(directory))}` : undefined; },
    configureServer(server) {
      server.watcher.add(directory);
      const refresh = (path: string) => {
        if (!path.startsWith(directory) || !path.endsWith(".jpg")) return;
        const module = server.moduleGraph.getModuleById(resolvedId);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", refresh);
      server.watcher.on("unlink", refresh);
    },
  };
}