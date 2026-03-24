'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface MovieItem {
  title: string;
  slug: string;
  year: number;
  rating: number;
  poster?: string;
  type?: string;
}

async function fetchAPI(endpoint: string) {
  const res = await fetch(`/api/proxy?endpoint=${endpoint}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetchAPI(`search?q=${encodeURIComponent(query)}`)
        .then(data => setResults(data.results || []))
        .catch(err => console.error('Search failed:', err))
        .finally(() => setLoading(false));
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const getPosterUrl = (movie: MovieItem) => {
    if (movie.poster) {
      return `https://image.tmdb.org/t/p/w300${movie.poster}`;
    }
    return '/placeholder.jpg';
  };

  return (
    <>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies and TV shows..."
            className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button type="submit" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] skeleton rounded-lg" />
          ))}
        </div>
      ) : query ? (
        results.length > 0 ? (
          <>
            <h2 className="text-2xl text-white mb-6">Results for "{query}"</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.map((movie, i) => (
                <Link
                  key={`${movie.slug}-${i}`}
                  href={`/${movie.type || 'movie'}/${movie.slug}`}
                  className="group"
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 mb-2">
                    <img
                      src={getPosterUrl(movie)}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-white text-sm font-medium truncate">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <span>{movie.year}</span>
                    {movie.rating > 0 && <span className="text-yellow-400">★ {movie.rating}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-400">No results found for "{query}"</h3>
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl text-gray-400">Search for movies and TV shows</h3>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black pt-32 px-4 md:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] skeleton rounded-lg" />
            ))}
          </div>
        }>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}