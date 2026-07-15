export function nativeEmbedUrl(video) {
  if (video.platform === 'tiktok') {
    return `https://www.tiktok.com/player/v1/${video.externalId}?autoplay=1&loop=0`;
  }

  if (video.platform === 'instagram') {
    const canonicalSource = video.sourceUrl.replace(/\/?(?:\?.*)?$/, '');
    return `${canonicalSource}/embed/`;
  }

  throw new Error('unsupported_video_platform');
}

export function parseShortFormVideoUrl(value) {
  let url;
  try {
    url = new URL(String(value || '').trim());
  } catch {
    throw new Error('invalid_video_url');
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'tiktok.com') {
    const externalId = url.pathname.match(/^\/@[A-Za-z0-9._]{1,64}\/video\/(\d+)\/?$/)?.[1];
    if (!externalId) throw new Error('use_full_tiktok_url');
    return { platform: 'tiktok', externalId };
  }
  if (host === 'instagram.com') {
    const externalId = url.pathname.match(/^\/(?:reel|p)\/([A-Za-z0-9_-]+)\/?$/)?.[1];
    if (!externalId) throw new Error('use_instagram_reel_url');
    return { platform: 'instagram', externalId };
  }
  throw new Error('unsupported_video_platform');
}

export function destinationFieldNoteHref(video) {
  if (!video?.destinationSlug || !video?.slug) return '/discover/';
  return `/regions/${video.destinationSlug}/#field-note-${video.slug}`;
}

const curatedCityBucket = {
  'Hong Kong': 'hong-kong',
  Shanghai: 'shanghai',
  Beijing: 'beijing',
  Chongqing: 'chongqing',
};

const slugify = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export function videoCuratedCollectionHref(video) {
  const city = curatedCityBucket[video?.city];
  const owner = slugify(video?.creator);
  const collection = video?.collectionSlug || slugify(video?.title);
  const hasResolvedPlace = video?.places?.some((place) => place.resolution === 'resolved');
  if (!city || !owner || !collection || !hasResolvedPlace) return null;
  return `/curated/${owner}/${collection}/${city}/`;
}
