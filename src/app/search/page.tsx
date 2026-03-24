'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchMovies, SearchResults } from '@/lib/api';
import MovieRow from '@/components/MovieRow';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchMovies(query).then((data) => {
        setResults(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 px-4 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
        Search Results for "{query}"
      </h1>
      <p className="text-gray-400 mb-8">
        {results?.results?.length || 0} results found
      </p>
      
      {results?.results && results.results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {results.results.map((item, index) => (
            <Link 
              key={`${item.slug}-${index}`} 
              href={`/${item.type || 'movie'}/${item.slug}`}
              className="group"
            >
              <div className="aspect-[2/3] rounded-md overflow-hidden bg-zinc-800">
                <img 
                  src={item.poster ? `https://image.tmdb.org/t/p/w300${item.poster}` : '/placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-white text-sm mt-2 truncate group-hover:text-red-500 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <span>{item.year}</span>
                {item.rating > 0 && <span>★ {item.rating}</span>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400">No results found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}