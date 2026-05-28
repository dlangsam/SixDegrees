import { useState, useEffect } from 'react'
import { findShortestPath } from '../utils/bfs'
import { getApiKey } from '../api/apiKey'

export function useBidirectionalBFS(startActorId, autoStart = false) {
  const [status, setStatus] = useState('idle') // 'idle' | 'running' | 'done' | 'failed'
  const [optimalPath, setOptimalPath] = useState(null)
  const [progress, setProgress] = useState({ degree: 0, forwardSize: 0, backwardSize: 0 })

  const start = async () => {
    if (!startActorId) return

    setStatus('running')
    setOptimalPath(null)

    const apiKey = getApiKey()

    const handleProgress = (progressData) => {
      setProgress(progressData)
      if (progressData.status === 'done' || progressData.status === 'failed') {
        setStatus(progressData.status)
      }
    }

    try {
      const path = await findShortestPath(startActorId, apiKey, handleProgress)
      setOptimalPath(path)
    } catch (error) {
      console.error('BFS failed:', error)
      setStatus('failed')
    }
  }

  useEffect(() => {
    if (autoStart && startActorId) {
      start()
    }
  }, [autoStart, startActorId])

  return {
    status,
    optimalPath,
    progress,
    start
  }
}
