import { createClient } from "@/lib/supabase/server";
import type { Menu } from "@/lib/types";

export async function getMenu(slug: string, publishedOnly = true): Promise<Menu | null> {
  const supabase = await createClient();
  let query = supabase.from("menus").select("id,slug,business_name,logo_url,accent_color,is_published,categories(id,menu_id,name,description,position,products(id,category_id,name,description,price,label,position,is_available))").eq("slug", slug);
  if (publishedOnly) query = query.eq("is_published", true);
  const { data, error } = await query.single();
  if (error || !data) return null;
  return { ...data, categories: (data.categories ?? []).sort((a, b) => a.position - b.position).map((category) => ({ ...category, products: (category.products ?? []).filter((p) => p.is_available).sort((a, b) => a.position - b.position) })) } as Menu;
}
