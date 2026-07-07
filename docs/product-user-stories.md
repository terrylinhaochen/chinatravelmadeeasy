# Product User Stories

## Core Prototype Loop

1. As a new user, I can sign in with an email so saved lists and collected maps have one visible home.
2. As a signed-in user, I can paste a link, caption, screenshot note, or place list and preview extracted pins before saving.
3. As a signed-in user, I can save an uploaded pin list and find it later on Profile.
4. As a traveler browsing Curated, I can collect another person's city map and find it later on Profile.
5. As a traveler reviewing Profile, I can see uploaded lists and collected city maps separately, then reopen the source city or map-ready pins.
6. As a user opening a Supabase email link, the app exchanges the callback payload before reading the profile user, so the profile should not render a `null` session after redirect.

## Local Prototype State

- `ctme-map-user`: browser-local signed-in user.
- `ctme-map-saved-places`: uploaded or extracted pin lists.
- `ctme-collected-curated`: curated maps collected from other people.

This is intentionally local-only until there is a backend account system.

## Supabase Email Links

The callback page is `/auth/confirm/`. It handles Supabase `token_hash`, PKCE `code`, and implicit `access_token` links, then writes the confirmed user into the same profile state used by the local prototype.
