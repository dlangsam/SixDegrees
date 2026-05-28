export default function BfsProgress({ progress, status }) {
  if (status === 'idle') return null

  const getProgressMessage = () => {
    if (status === 'done') return 'Path found!'
    if (status === 'failed') return 'Search complete'

    const { degree, forwardSize, backwardSize } = progress

    if (degree === 1) {
      return 'Checking direct connections...'
    } else if (degree === 2) {
      return "Exploring Kevin Bacon's network..."
    } else {
      const totalSearching = forwardSize + backwardSize
      return `Searching ${totalSearching.toLocaleString()} actors at degree ${degree}...`
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {status === 'running' && (
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
      <p className="text-cream/80 font-body text-lg">
        {getProgressMessage()}
      </p>
      {status === 'running' && progress.degree > 0 && (
        <p className="text-cream/50 text-sm">
          Degree {progress.degree} of 6
        </p>
      )}
    </div>
  )
}
