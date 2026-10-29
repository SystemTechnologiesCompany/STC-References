# STC References

A responsive burgundy, beige, and off-white academic discovery landing page with English/French copy, an interactive 3D compass, a cinematic full-scale GLB scene, field discovery cards, and Supabase email / Google authentication hooks.

## Connect Supabase

1. Create a Supabase project and add its Project URL and public anon or publishable key to `config.js`.
2. Run the latest `supabase-schema.sql` in the Supabase SQL editor to create the tables and row-level security policies.
3. Enable Email and Google providers under Authentication → Sign In / Providers. For Google, enter the OAuth client ID and secret in Supabase and add Supabase's callback URL (`https://<project-ref>.supabase.co/auth/v1/callback`) to the Google OAuth client's authorized redirect URIs. Add the deployed site origin to its authorized JavaScript origins.
4. Set the deployed site origin as the Supabase Site URL and add it to Supabase's allowed redirect URLs.
5. Create an account, find its UUID in Authentication → Users, and promote it with the final SQL statement in `supabase-schema.sql`.

The browser uses only the public anon or publishable key. Authentication is enabled in `config.js`; email and Google sign-in will work after the project URL, public key, providers, and redirect URLs are configured. Never put the Google client secret or a Supabase service-role key in browser files. Row-level security limits reference creation, editing, and deletion to profiles whose role is `admin`; newly registered accounts receive the regular `user` role.

## Run locally

Serve this folder over HTTP so the browser can load the local GLB files (for example, `python -m http.server 8000` from this folder, then open `http://localhost:8000`). Authentication needs the Supabase project values and is unavailable until `config.js` is filled in. The 3D study atlas loads only the currently selected GLB, recolors it into the brand palette, and lets visitors rotate it with pointer or touch. The interactive model viewer uses Three.js from jsDelivr. Optimized copies in `models-web/` keep downloads smaller while preserving the original files. Static hosting is sufficient for the site; Supabase handles accounts and the reference catalog.
