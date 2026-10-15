# Menu Studio

Responsive Next.js menu management with Supabase Auth/Postgres, stable public links, QR download, and print-ready two-sided menu layouts.

## Set up

1. Create a Supabase project. In **Authentication > URL Configuration**, add `http://localhost:3000` and your deployed domain as redirect URLs.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and fill in the project URL, anon key, and production `NEXT_PUBLIC_SITE_URL`.
4. In Supabase **Authentication > Users**, create each administrator with an email and password. Run `npm install`, then `npm run dev`, and sign in at `/login`.
5. In `/admin`, create your first menu, add categories/products, then Publish. Its permanent public URL is `/menu/{slug}`; editing and republishing never changes it.

## Operations

All writes use the browser client under PostgreSQL Row Level Security. Only a menu owner can change a menu, its categories, or its products. Public readers can see only published menus. Do not add a Supabase service-role key to this project.

The PDF action uses the browser print engine: select **Save as PDF** after choosing A4, flyer, or folded brochure. The print template is isolated in `components/print-menu.tsx`; alter its styling and structure without touching menu data or the public page.

## Deployment

Deploy to Vercel (or any Next.js host), set the three environment values there, and add the deployed URL to Supabase Auth redirects. No database migration runs automatically; apply the included SQL before first deployment.
