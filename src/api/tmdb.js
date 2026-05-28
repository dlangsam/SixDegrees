const BASE = 'https://api.themoviedb.org/3'

export const getPopularActors = async (apiKey, page = 1) => {
  const response = await fetch(`${BASE}/person/popular?api_key=${apiKey}&page=${page}`)
  if (response.status === 429) {
    // Rate limit hit - wait 10s and retry
    await new Promise(resolve => setTimeout(resolve, 10000))
    return getPopularActors(apiKey, page)
  }
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }
  return response.json()
}

export const getActorMovies = async (actorId, apiKey) => {
  const response = await fetch(`${BASE}/person/${actorId}/movie_credits?api_key=${apiKey}`)
  if (response.status === 429) {
    await new Promise(resolve => setTimeout(resolve, 10000))
    return getActorMovies(actorId, apiKey)
  }
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }
  return response.json()
}

export const getMovieCast = async (movieId, apiKey) => {
  const response = await fetch(`${BASE}/movie/${movieId}/credits?api_key=${apiKey}`)
  if (response.status === 429) {
    await new Promise(resolve => setTimeout(resolve, 10000))
    return getMovieCast(movieId, apiKey)
  }
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }
  return response.json()
}

export const searchPerson = async (query, apiKey) => {
  const response = await fetch(
    `${BASE}/search/person?api_key=${apiKey}&query=${encodeURIComponent(query)}`
  )
  if (response.status === 429) {
    await new Promise(resolve => setTimeout(resolve, 10000))
    return searchPerson(query, apiKey)
  }
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }
  return response.json()
}

export const validateApiKey = async (apiKey) => {
  try {
    await getPopularActors(apiKey, 1)
    return true
  } catch {
    return false
  }
}

// Helper to get image URL
export const getImageUrl = (path, size = 'w185') => {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

// Kevin Bacon's TMDB ID
export const KEVIN_BACON_ID = 4724
