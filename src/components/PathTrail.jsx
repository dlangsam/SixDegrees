export default function PathTrail({ startingActor, path, currentActor }) {
  return (
    <div className="bg-noir-dark border border-gold/20 rounded-lg p-4 overflow-x-auto">
      <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
        {/* Starting actor */}
        <span className="text-cream font-semibold px-3 py-1 bg-gold/20 rounded-full">
          {startingActor.name}
        </span>

        {/* Path taken so far */}
        {path.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-gold">→</span>
            <span className="text-cream/70 italic">{step.movie.title}</span>
            <span className="text-gold">→</span>
            <span className="text-cream font-semibold px-3 py-1 bg-gold/20 rounded-full">
              {step.actor.name}
            </span>
          </div>
        ))}

        {/* Current selection in progress */}
        {currentActor && currentActor.id !== startingActor.id && (
          <div className="flex items-center gap-2">
            <span className="text-gold">→</span>
            <span className="text-cream/50">...</span>
          </div>
        )}
      </div>
    </div>
  )
}
