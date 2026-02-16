import { resolveImageUrl } from './api';

export const preloadImageUrls = (urls = [], maxImages = 24) => {
  const uniqueUrls = [...new Set(urls.filter(Boolean))].slice(0, maxImages);

  uniqueUrls.forEach((url) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = resolveImageUrl(url);
  });
};
