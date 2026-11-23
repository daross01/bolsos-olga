import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductCard } from "@/components/ProductCard";
import { formatPrice, products } from "@/data/products";

const product = (ref: string) => {
  const found = products.find((p) => p.ref === ref);
  if (!found) throw new Error(`Falta el producto ${ref}`);
  return found;
};

const buy = () => screen.getByRole("link", { name: /quiero este modelo/i }) as HTMLAnchorElement;
const customize = () =>
  screen.getByRole("link", { name: /personalizar este modelo/i }) as HTMLAnchorElement;

describe("tarjeta de producto", () => {
  it("ofrece comprar y personalizar cuando el modelo está disponible", () => {
    const available = product("B002");
    render(<ProductCard product={available} />);

    expect(screen.getByText(/comprar\s*·\s*personalizar/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: available.name }));
    expect(buy().href).toContain("wa.me");
    expect(customize().href).toContain("wa.me");
  });

  it("solo ofrece personalizar cuando el modelo exacto no está disponible", () => {
    const gone = product("B001");
    render(<ProductCard product={gone} />);

    expect(screen.getByText(/^personalizar$/i)).toBeInTheDocument();
    expect(screen.queryByText(/comprar\s*·/i)).toBeNull();
    expect(screen.queryByText(/no disponible/i)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: gone.name }));
    expect(screen.queryByRole("link", { name: /quiero este modelo/i })).toBeNull();
    expect(screen.getByRole("button", { name: /quiero este modelo/i })).toBeDisabled();
    expect(screen.queryByText(/uno igual/i)).toBeNull();
    expect(customize().href).toContain("wa.me");
  });

  it("explica que no quedan las mismas telas ni materiales", () => {
    const gone = product("B001");
    render(<ProductCard product={gone} />);

    fireEvent.click(screen.getByRole("button", { name: gone.name }));
    expect(screen.getByText(/no quedan las mismas telas/i)).toBeInTheDocument();
  });

  it("en tres por fila solo muestra el precio, sin nombre ni opciones", () => {
    const available = product("B002");
    render(<ProductCard product={available} cols={3} />);

    expect(screen.queryByText(available.name)).toBeNull();
    expect(screen.queryByText(/comprar\s*·\s*personalizar/i)).toBeNull();
    expect(screen.getByText(formatPrice(available.price))).toBeInTheDocument();
  });

  it("en dos por fila mantiene nombre y opciones", () => {
    const available = product("B002");
    render(<ProductCard product={available} cols={2} />);

    expect(screen.getByText(available.name)).toBeInTheDocument();
    expect(screen.getByText(/comprar\s*·\s*personalizar/i)).toBeInTheDocument();
  });
});
