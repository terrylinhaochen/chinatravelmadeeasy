# How do I turn a China travel link from social media into a saved place on my map?

Source action: `china-action-03`
Context pack: `china-travel-help-loop`
Status: review_only_draft

## Traveler Problem

Travelers discover restaurants, neighborhoods, hotels, tea houses, and attractions in scattered posts, but saving those places into Apple Maps or a China map app is tedious.

## Required Place Fields

- `place_name`
- `city`
- `address_hints`
- `recommendation_reason`
- `source_url`
- `map_search_query`

## Source Evidence

- No source-linked evidence captured yet.

## Draft Job

- Extract place identity separately from recommendation reason.
- Keep Chinese alias, English name, city, and address hints separate.
- Mark unresolved address data as evidence_needed.
- Generate a map search query only when enough source context exists.

## Writeback Required

- `place_card_id`
- `source_urls_used`
- `place_name_city_address_hints`
- `recommendation_reason`
- `map_workflow_status`
- `user_save_or_click_status`
