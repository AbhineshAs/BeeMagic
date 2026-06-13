const API_URL = import.meta.env.VITE_API_URL || '';

export const formatImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
  }
  return url;
};

export default API_URL;
