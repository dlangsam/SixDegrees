import { getImageUrl } from '../api/tmdb'

export default function MovieCard({ movie, onClick, className = '' }) {
  const posterUrl = getImageUrl(movie.poster_path, 'w342')
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : ''

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 active:scale-95 ${className}`}
    >
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-noir-dark flex items-center justify-center p-4">
          <span className="text-cream/30 text-center text-sm">{movie.title}</span>
        </div>
      )}

      {/* Always visible title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-noir-darker via-noir-darker/90 to-transparent p-3">
        <p className="text-cream font-semibold text-sm line-clamp-2">{movie.title}</p>
        {year && (
          <p className="text-cream/60 text-xs">{year}</p>
        )}
      </div>
    </button>
  )
}
