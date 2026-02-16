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
