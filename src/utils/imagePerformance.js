import { resolveImageUrl } from './api';

const normalizeToUrls = (entry) => {
  if (!entry) return [];
  if (typeof entry === 'string') return [entry];
  if (typeof entry === 'object') {
    return [entry.default, entry.sm, entry.md, entry.lg].filter(Boolean);
  }
  return [];
};

export const preloadImageUrls = (urls = [], maxImages = 24) => {
  const flattened = urls.flatMap(normalizeToUrls);
  const uniqueUrls = [...new Set(flattened.filter(Boolean))].slice(0, maxImages);

  uniqueUrls.forEach((url) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = resolveImageUrl(url);
  });
};
