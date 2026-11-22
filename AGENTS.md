<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->
# AGENTS
- Product structure lives in src/data/products.ts; names, prices, availability, visibility and photo folders come from src/data/productos.csv, and site settings from src/data/config.ts — one editable source per setting.
- Catalog photos use root-relative /productos/ URLs matching the exact filenames in public/productos so external hosts serve them without a Lovable asset proxy.
- Every photo in public/productos is a lowercase `.jpg`; convert and rename any new upload before referencing it, because extensions and letter case are case-sensitive when served.
- Site titles read the name from siteConfig.tagline so browser and shared-link titles stay consistent.
- Discover gallery JPG paths through the build-time catalog-photos Vite plugin; ship only root-relative URLs to the browser and Worker, so gallery folders need no manual image list or runtime filesystem access.
- Derive all favicon sizes from the supplied SVG and serve the ICO with a versioned head link to avoid stale browser icons.
