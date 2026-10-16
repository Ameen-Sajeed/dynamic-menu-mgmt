# Menu Studio

Responsive Next.js price-list management with Supabase Auth/Postgres, stable public links, QR download, and a downloadable Blue Basket PDF.

## Set up

1. Create a Supabase project. In **Authentication > URL Configuration**, add `http://localhost:3000` and your deployed domain as redirect URLs.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and fill in the project URL, anon key, and production `NEXT_PUBLIC_SITE_URL`.
4. In Supabase **Authentication > Users**, create each administrator with an email and password. Run `npm install`, then `npm run dev`, and sign in at `/login`.
5. In `/admin`, select **Set up Blue Basket menu** to load the supplied Men, Ladies, and General price list. You can add, edit, or delete categories and items, then Publish. Its permanent public URL is `/menu/{slug}`; editing and republishing never changes it.

## Operations

All writes use the browser client under PostgreSQL Row Level Security. Only a menu owner can change a menu, its categories, or its products. Public readers can see only published menus. Do not add a Supabase service-role key to this project.

After publishing, **Download PDF** produces a clean A4 price list from the current published menu. The reusable PDF renderer in `lib/pdf/blue-basket-menu.ts` uses the supplied official logo and Blue Basket price-table layout; it paginates category tables before they can be clipped.

## Deployment

Deploy to Vercel (or any Next.js host), set the three environment values there, and add the deployed URL to Supabase Auth redirects. No database migration runs automatically; apply the included SQL before first deployment.
