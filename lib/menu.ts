import { createClient } from "@/lib/supabase/server";
import type { Menu } from "@/lib/types";

export async function getMenu(slug: string, publishedOnly = true): Promise<Menu | null> {
  const supabase = await createClient();
  let query = supabase.from("menus").select("id,slug,business_name,logo_url,accent_color,is_published,categories(id,menu_id,name,description,position,products(id,category_id,name,description,price,press_price,wash_press_price,dry_clean_price,label,position,is_available))").eq("slug", slug);
  if (publishedOnly) query = query.eq("is_published", true);
  const { data, error } = await query.single();
  if (error || !data) return null;
  return { ...data, categories: (data.categories ?? []).sort((a, b) => a.position - b.position).map((category) => ({ ...category, products: (category.products ?? []).filter((p) => publishedOnly ? p.is_available : true).sort((a, b) => a.position - b.position) })) } as Menu;
}
