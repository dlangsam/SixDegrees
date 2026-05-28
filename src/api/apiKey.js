// Get API key from environment variable or localStorage
export function getApiKey() {
  return import.meta.env.VITE_TMDB_API_KEY || localStorage.getItem('tmdb_api_key')
}

export function hasApiKey() {
  return !!getApiKey()
}

export function setApiKey(key) {
  localStorage.setItem('tmdb_api_key', key)
}
