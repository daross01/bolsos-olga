import { Flower2 } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Flower2 aria-hidden className="h-6 w-6 text-muted-foreground" strokeWidth={1.25} />
        <a
          href={whatsappLink("¡Hola! Estoy interesada en comprar un bolso y me gustaría saber cómo funciona el proceso para hacer un encargo.")}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          Hacer un encargo
        </a>
      </div>
    </header>
  );
}
