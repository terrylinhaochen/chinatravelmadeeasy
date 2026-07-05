# World Pixel Atlas Design

The atlas is a GitHub-style square grid that maps real coordinates into a projected world map.

## Model

- Projection: Equal Earth.
- Extent: inhabited-world crop, `-60` to `85` latitude, so Antarctica does not compress the travel map.
- Projected ratio: `2.257:1`.
- Grid: `112 x 50` cells, a `2.24:1` square-cell approximation of the projected extent.
- Ratio error: about `0.017`, stored in the generated atlas metadata.
- Land mask: generated from Natural Earth `ne_110m_land.geojson`.
- Region anchors: province/city coordinates in `src/data/destinationCoordinates.ts`.
- Frequency: current vertical slice uses place count, guide count, and featured-region bonus.

Each cell has a stable key: `column:row`. A coordinate maps to a cell with:

1. Convert longitude/latitude to Equal Earth projected `x/y`.
2. Normalize `x/y` into the atlas bounds.
3. Quantize to integer column and row.

This keeps the atlas mathematically anchored while still feeling like a compact shareable object. A full-pole world would be `2.055:1`, but it spends many rows on Antarctica, which is not useful for this travel-planning surface.

## Product Surfaces

- `PinDensityPanel.astro`: interactive homepage/onboarding atlas.
- `/atlas/demo.svg`: static SVG export for GitHub READMEs and websites.

## Next Step

The current vertical slice maps destinations to anchor cells. The next version should rasterize region polygons, so a province can own multiple cells and a user pin can light the exact region cell plus roll up into province/country totals.
