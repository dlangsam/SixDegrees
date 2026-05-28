import { getCachedActorMovies, getCachedMovieCast } from '../api/cache'

const KEVIN_BACON_ID = 4724

export async function findShortestPath(startActorId, apiKey, onProgress) {
  // Each frontier is a Map of actorId -> path taken to reach them
  const forwardFrontier = new Map([[startActorId, []]])
  const backwardFrontier = new Map([[KEVIN_BACON_ID, []]])

  const forwardVisited = new Map([[startActorId, []]])
  const backwardVisited = new Map([[KEVIN_BACON_ID, []]])

  let degree = 0
  const maxDegrees = 6 // Stop after 6 degrees

  while (forwardFrontier.size > 0 && backwardFrontier.size > 0 && degree < maxDegrees) {
    degree++
    onProgress?.({
      degree,
      forwardSize: forwardFrontier.size,
      backwardSize: backwardFrontier.size,
      status: 'running'
    })

    // Always expand the smaller frontier for efficiency
    const expandForward = forwardFrontier.size <= backwardFrontier.size
    const frontier = expandForward ? forwardFrontier : backwardFrontier
    const visited = expandForward ? forwardVisited : backwardVisited
    const otherVisited = expandForward ? backwardVisited : forwardVisited

    const nextFrontier = new Map()

    // Fetch all movies for actors in current frontier in parallel
    const actorIds = [...frontier.keys()]
    const movieSets = await Promise.all(
      actorIds.map(id => getCachedActorMovies(id, apiKey))
    )

    // Collect all unique movie IDs and their source actors
    const movieMap = new Map()
    actorIds.forEach((actorId, i) => {
      const movies = movieSets[i] || []
      movies.forEach(movie => {
        if (!movieMap.has(movie.id)) {
          movieMap.set(movie.id, { movie, fromActor: actorId })
        }
      })
    })

    // Fetch all casts in parallel
    const movieIds = [...movieMap.keys()]
    const castSets = await Promise.all(
      movieIds.map(movieId => getCachedMovieCast(movieId, apiKey))
    )

    // Process results
    for (let i = 0; i < movieIds.length; i++) {
      const movieId = movieIds[i]
      const { movie, fromActor } = movieMap.get(movieId)
      const cast = castSets[i] || []

      for (const actor of cast) {
        if (visited.has(actor.id)) continue

        const pathToHere = [
          ...frontier.get(fromActor),
          { actorId: fromActor, movie, nextActorId: actor.id }
        ]

        visited.set(actor.id, pathToHere)
        nextFrontier.set(actor.id, pathToHere)

        // Check if the frontiers have met
        if (otherVisited.has(actor.id)) {
          const otherPath = otherVisited.get(actor.id)

          // Merge the paths at the meeting point
          // If expanding forward: forward path + reversed backward path
          // If expanding backward: forward path + reversed backward path
          const meetingPath = expandForward
            ? [...pathToHere, ...reverseAndFlipPath(otherPath)]
            : [...otherPath, ...reverseAndFlipPath(pathToHere)]

          onProgress?.({
            degree,
            forwardSize: 0,
            backwardSize: 0,
            status: 'done'
          })

          return meetingPath
        }
      }
    }

    // Replace frontier with next level
    frontier.clear()
    nextFrontier.forEach((v, k) => frontier.set(k, v))
  }

  onProgress?.({
    degree,
    forwardSize: 0,
    backwardSize: 0,
    status: 'failed'
  })

  return null // No path found within 6 degrees
}

// Helper to reverse and flip a path from the backward search
function reverseAndFlipPath(path) {
  const reversed = []
  for (let i = path.length - 1; i >= 0; i--) {
    const step = path[i]
    reversed.push({
      actorId: step.nextActorId,
      movie: step.movie,
      nextActorId: step.actorId
    })
  }
  return reversed
}
