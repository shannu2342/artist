export const API_BASE = (import.meta.env.VITE_API_URL || '').trim();

export const apiUrl = (path = '') => {
  if (!path) return API_BASE || '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalizedPath}` : normalizedPath;
};

export const resolveImageUrl = (url = '') => {
  if (!url) return url;
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/assets/')) {
    return url;
  }
  return apiUrl(encodeURI(url));
};

export const getResponsiveImage = (imageOrVariants, sizes = '100vw', options = {}) => {
  if (!imageOrVariants) {
    return { src: '', srcSet: '', sizes: '' };
  }

  const { includeFull = true } = options;

  if (typeof imageOrVariants === 'string') {
    return {
      src: resolveImageUrl(imageOrVariants),
      srcSet: '',
      sizes: ''
    };
  }

  const sm = resolveImageUrl(imageOrVariants.small || imageOrVariants.sm || '');
  const md = resolveImageUrl(imageOrVariants.medium || imageOrVariants.md || '');
  const lg = includeFull
    ? resolveImageUrl(imageOrVariants.full || imageOrVariants.lg || imageOrVariants.default || '')
    : '';
  const src = resolveImageUrl(
    imageOrVariants.medium ||
    imageOrVariants.default ||
    imageOrVariants.full ||
    imageOrVariants.md ||
    imageOrVariants.lg ||
    imageOrVariants.small ||
    imageOrVariants.sm ||
    ''
  );

  const srcSet = [
    sm ? `${sm} 640w` : '',
    md ? `${md} 1080w` : '',
    lg ? `${lg} 1600w` : ''
  ].filter(Boolean).join(', ');

  return {
    src,
    srcSet,
    sizes: srcSet ? sizes : ''
  };
};
