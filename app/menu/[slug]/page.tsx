import { notFound } from "next/navigation";
import { getMenu } from "@/lib/menu";
import { MenuView } from "@/components/menu-view";
export default async function PublicMenu({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const menu = await getMenu(slug); if (!menu) notFound(); return <MenuView menu={menu} />; }
