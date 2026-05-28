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

// Wrap API calls with cache and pruning
export async function getCachedActorMovies(actorId, apiKey) {
  const key = `actor_${actorId}`
  const cached = getCached(key)
  if (cached) return cached

  const data = await getActorMovies(actorId, apiKey)
  // Sort by popularity and take top 10
  const movies = (data.cast || [])
    .filter(m => m.poster_path) // Only movies with posters
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10)

  setCached(key, movies)
  return movies
}

export async function getCachedMovieCast(movieId, apiKey) {
  const key = `movie_${movieId}`
  const cached = getCached(key)
  if (cached) return cached

  const data = await getMovieCast(movieId, apiKey)
  // Take top 20 billed cast members with profile images
  const cast = (data.cast || [])
    .filter(c => c.profile_path) // Only actors with photos
    .slice(0, 20)

  setCached(key, cast)
  return cast
}
