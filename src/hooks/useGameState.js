import { useState, useEffect } from 'react'

// Simple state management without external library
// Using a singleton pattern with React hooks

let gameState = {
  startingActor: null,
  currentActor: null,
  path: [],
  phase: 'actor_pick', // 'actor_pick' | 'movie_pick' | 'won' | 'loading'
  degreesUsed: 0,
  optimalPath: null,
  bfsStatus: 'idle', // 'idle' | 'running' | 'done' | 'failed'
}

let listeners = []

function notifyListeners() {
  listeners.forEach(listener => listener(gameState))
}

export function useGameState() {
  const [, setState] = useState({})

  useEffect(() => {
    const listener = () => setState({})
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  return gameState
}

export function setStartingActor(actor) {
  gameState = {
    ...gameState,
    startingActor: actor,
    currentActor: actor,
    path: [],
    degreesUsed: 0,
    phase: 'movie_pick',
  }
  notifyListeners()
}

export function selectMovie(movie) {
  gameState = {
    ...gameState,
    phase: 'actor_pick',
  }
  notifyListeners()
}

export function selectActor(actor, movie) {
  const newPath = [...gameState.path, { actor: gameState.currentActor, movie }]

  gameState = {
    ...gameState,
    currentActor: actor,
    path: newPath,
    degreesUsed: newPath.length,
    phase: 'movie_pick',
  }
  notifyListeners()
}

export function setWon() {
  gameState = {
    ...gameState,
    phase: 'won',
  }
  notifyListeners()
}

export function setOptimalPath(path) {
  gameState = {
    ...gameState,
    optimalPath: path,
  }
  notifyListeners()
}

export function setBfsStatus(status) {
  gameState = {
    ...gameState,
    bfsStatus: status,
  }
  notifyListeners()
}

export function resetGame() {
  gameState = {
    startingActor: null,
    currentActor: null,
    path: [],
    phase: 'actor_pick',
    degreesUsed: 0,
    optimalPath: null,
    bfsStatus: 'idle',
  }
  notifyListeners()
}

export function getGameState() {
  return gameState
}
