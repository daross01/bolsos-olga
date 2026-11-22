import { siteConfig } from "@/data/config";
import { whatsappLink } from "@/lib/whatsapp";

export function SiteFooter() {
  const cls = "text-muted-foreground hover:text-foreground transition-colors";
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-8 text-xs uppercase tracking-[0.15em]">
        <div className="flex gap-6">
          <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className={cls}>Instagram</a>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className={cls}>WhatsApp</a>
        </div>
        <p className="normal-case tracking-normal text-muted-foreground">Cada pieza está hecha a mano.</p>
      </div>
    </footer>
  );
}
