import { getActorMovies, getMovieCast } from './tmdb'

const PREFIX = 'tmdb_cache_'

export function getCached(key) {
  try {
    const raw = sessionStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCached(key, value) {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // sessionStorage full - fail silently
  }
}

// Wrap API calls with cache
export async function getCachedActorMovies(actorId, apiKey) {
  const key = `actor_${actorId}`
  const cached = getCached(key)
  if (cached) return cached

  const data = await getActorMovies(actorId, apiKey)
  // Get ALL movies with posters, sorted by popularity
  const movies = (data.cast || [])
    .filter(m => m.poster_path) // Only movies with posters
    .sort((a, b) => b.popularity - a.popularity)

  setCached(key, movies)
  return movies
}

export async function getCachedMovieCast(movieId, apiKey) {
  const key = `movie_${movieId}`
  const cached = getCached(key)
  if (cached) return cached

  const data = await getMovieCast(movieId, apiKey)
  // Get ALL cast members with profile images (billed cast only)
  const cast = (data.cast || [])
    .filter(c => c.profile_path) // Only actors with photos

  setCached(key, cast)
  return cast
}
