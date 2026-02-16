export const API_BASE = import.meta.env.VITE_API_URL || 'https://artist-portfoilo.onrender.com';

export const apiUrl = (path = '') => {
  if (!path) return API_BASE;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const resolveImageUrl = (url = '') => {
  if (!url) return url;
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    const filename = url.replace('/uploads/', '');
    return apiUrl(`/api/files/name/${encodeURIComponent(filename)}`);
  }
  return apiUrl(encodeURI(url));
};

export const getResponsiveImage = (imageOrVariants, sizes = '100vw') => {
  if (!imageOrVariants) {
    return { src: '', srcSet: '', sizes: '' };
  }

  if (typeof imageOrVariants === 'string') {
    return {
      src: resolveImageUrl(imageOrVariants),
      srcSet: '',
      sizes: ''
    };
  }

  const sm = resolveImageUrl(imageOrVariants.sm || '');
  const md = resolveImageUrl(imageOrVariants.md || '');
  const lg = resolveImageUrl(imageOrVariants.lg || imageOrVariants.default || '');
  const src = resolveImageUrl(imageOrVariants.default || imageOrVariants.lg || imageOrVariants.md || imageOrVariants.sm || '');

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
