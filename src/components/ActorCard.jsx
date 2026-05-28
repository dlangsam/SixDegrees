import { getImageUrl } from '../api/tmdb'

export default function ActorCard({ actor, onClick, className = '' }) {
  const imageUrl = getImageUrl(actor.profile_path)

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 active:scale-95 ${className}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={actor.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-noir-dark flex items-center justify-center">
          <span className="text-cream/30 text-4xl">?</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-noir-darker via-noir-darker/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
        <p className="text-cream font-semibold text-sm truncate">{actor.name}</p>
        {actor.known_for_department && (
          <p className="text-cream/60 text-xs">{actor.known_for_department}</p>
        )}
      </div>
    </button>
  )
}
