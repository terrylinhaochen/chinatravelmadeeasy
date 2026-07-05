import { destinations } from '../../data/destinations';
import { destinationCoordinates } from '../../data/destinationCoordinates';
import { isWorldPixelLand, projectLonLatToWorldCell, worldPixelAtlas, worldPixelKey } from '../../data/worldPixelAtlas';

export const prerender = true;

const cellSize = 7;
const gap = 2;
const padding = 24;
const titleHeight = 52;
const footerHeight = 36;
const width = padding * 2 + worldPixelAtlas.columns * cellSize + (worldPixelAtlas.columns - 1) * gap;
const mapHeight = worldPixelAtlas.rows * cellSize + (worldPixelAtlas.rows - 1) * gap;
const height = padding * 2 + titleHeight + mapHeight + footerHeight;
const regionCount = destinations.length;
const cityAreaCount = new Set(destinations.flatMap((destination) => destination.places.map((place) => place.area))).size;
const pinCount = destinations.reduce((total, destination) => total + destination.places.length, 0);

function densityFor(destination: (typeof destinations)[number]) {
  const base = destination.places.length * 2 + destination.guideIds.length;
  const bonus = destination.featured ? 4 : destination.type === 'Municipality' ? 2 : 0;
  return Math.min(5, Math.max(1, Math.round((base + bonus) / 3)));
}

const activeCells = new Map<string, { name: string; density: number; placeCount: number }>();

for (const destination of destinations) {
  const coordinate = destinationCoordinates[destination.slug];
  if (!coordinate) continue;
  const cell = projectLonLatToWorldCell(coordinate.lon, coordinate.lat);
  const key = worldPixelKey(cell.column, cell.row);
  const density = densityFor(destination);
  const existing = activeCells.get(key);
  if (!existing || density > existing.density) {
    activeCells.set(key, {
      name: destination.name,
      density,
      placeCount: destination.places.length,
    });
  }
}

function fillForDensity(density: number) {
  return {
    1: '#d9b7b0',
    2: '#c98e84',
    3: '#b96c60',
    4: '#a44739',
    5: '#8c2f22',
  }[density] ?? '#d9b7b0';
}

function escapeXml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char] ?? char);
}

function renderSvg() {
  const rects: string[] = [];
  for (let row = 1; row <= worldPixelAtlas.rows; row += 1) {
    for (let column = 1; column <= worldPixelAtlas.columns; column += 1) {
      const key = worldPixelKey(column, row);
      const active = activeCells.get(key);
      const land = isWorldPixelLand(column, row);
      if (!land && !active) continue;
      const x = padding + (column - 1) * (cellSize + gap);
      const y = padding + titleHeight + (row - 1) * (cellSize + gap);
      const fill = active ? fillForDensity(active.density) : '#dedad5';
      const opacity = active ? '1' : '0.62';
      rects.push(
        `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="1.6" fill="${fill}" opacity="${opacity}">${
          active ? `<title>${escapeXml(active.name)}: ${active.placeCount} pins</title>` : ''
        }</rect>`,
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <title id="title">China Travel Made Easy saved-place pixel atlas</title>
  <desc id="desc">A GitHub-style Equal Earth pixel world map where darker cells show saved-place density.</desc>
  <rect width="100%" height="100%" rx="22" fill="#f8f7f5"/>
  <text x="${padding}" y="${padding + 20}" fill="#292524" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700">Saved-place atlas</text>
  <text x="${padding}" y="${padding + 42}" fill="#777169" font-family="Inter, Arial, sans-serif" font-size="12">${regionCount} regions · ${cityAreaCount} cities/areas · ${pinCount} pins</text>
  <g>${rects.join('')}</g>
  <text x="${padding}" y="${height - 18}" fill="#777169" font-family="Inter, Arial, sans-serif" font-size="12">Generated from Equal Earth projected pixels · chinatravelmadeeasy.com</text>
</svg>`;
}

export async function GET() {
  return new Response(renderSvg(), {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
