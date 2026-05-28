export default function Footer() {
  return (
    <footer className="bg-noir-darker border-t border-gold/10 py-6 mt-auto">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex flex-col items-center gap-3">
          {/* TMDB Attribution */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="TMDB Logo"
                className="h-8"
              />
            </a>
          </div>

          <p className="text-cream/50 text-xs max-w-2xl">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>

          <p className="text-cream/40 text-xs">
            Made with ❤️ by Devorah + Claude • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
