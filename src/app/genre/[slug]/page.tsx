'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function GenrePage() {
  const params = useParams();
  const genreSlug = params.slug as string;
  
  const [results, setResults] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchAPI(`genre/${genreSlug}?page=${page}`);
        setResults(data.results || []);
        setHasNext(data.has_next_page || false);
      } catch (err) {
        console.error('Failed to load:', err);
      } finally {
        setLoading(false);
      }
    }
    if (genreSlug) load();
  }, [genreSlug, page]);

  const getPosterUrl = (movie: MovieItem) => {
    if (movie.poster) return `https://image.tmdb.org/t/p/w300${movie.poster}`;
    return '/placeholder.jpg';
  };

  const title = genreSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-black pt-32 px-4 md:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">{title}</h1>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] skeleton rounded-lg" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
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
            
            <div className="flex justify-center gap-4 mt-12">
              {page > 1 && (
                <button onClick={() => setPage(p => p - 1)} className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700">
                  Previous
                </button>
              )}
              {hasNext && (
                <button onClick={() => setPage(p => p + 1)} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Next
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-400">No content found</h3>
          </div>
        )}
      </div>
    </div>
  );
}