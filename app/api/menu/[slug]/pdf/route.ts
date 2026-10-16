import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { getMenu } from "@/lib/menu";
import { createBlueBasketMenuPdf } from "@/lib/pdf/blue-basket-menu";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const menu = await getMenu(slug);
  if (!menu) return new NextResponse("Published menu not found.", { status: 404 });

  const assetPath = join(process.cwd(), "public", "blue-basket");
  const logo = await readFile(join(assetPath, "logo_BB.png"));
  const pdf = await createBlueBasketMenuPdf(menu, { logo });
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}-price-list.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
