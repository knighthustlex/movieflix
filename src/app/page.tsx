'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface Genre {
  name: string;
  slug: string;
}

interface HeroItem {
  title: string;
  slug: string;
  type: 'movie' | 'tv';
  year: number;
  rating: number;
  quality: string;
  description: string;
  backdrop: string;
}

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

export default function Home() {
  const [hero, setHero] = useState<HeroItem | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [trending, setTrending] = useState<MovieItem[]>([]);
  const [topData, setTopData] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [homeData, trendingData, topData] = await Promise.all([
          fetchAPI('home').catch(() => null),
          fetchAPI('trending').catch(() => ({ results: [] })),
          fetchAPI('top-imdb').catch(() => ({ results: [] }))
        ]);
        
        if (homeData) {
          setHero(homeData.hero?.[0] || null);
          setGenres(homeData.genres || []);
        }
        setTrending(trendingData.results || []);
        setTopData(topData.results || []);
      } catch (err) {
        console.error('Failed to load:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = 400;
      rowRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getPosterUrl = (movie: MovieItem) => {
    if (movie.poster) {
      return `https://image.tmdb.org/t/p/w300${movie.poster}`;
    }
    return '/placeholder.jpg';
  };

  const backdropUrl = hero?.backdrop 
    ? `https://image.tmdb.org/t/p/original${hero.backdrop}` 
    : null;

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      {hero && (
        <div className="relative h-[80vh] w-full">
          {backdropUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${backdropUrl})`,
                filter: 'brightness(0.4)'
              }} 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end h-full px-4 pb-16 md:px-12 md:pb-24 max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{hero.title}</h1>
              <div className="flex items-center gap-4 mb-4 text-sm md:text-base">
                <span className="text-green-400 font-semibold">{hero.rating} Rating</span>
                <span className="text-gray-400">{hero.year}</span>
                <span className="text-gray-400">{hero.type === 'tv' ? 'TV Series' : 'Movie'}</span>
                {hero.quality && (
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded">{hero.quality}</span>
                )}
              </div>
              <p className="text-gray-300 text-sm md:text-lg mb-6 line-clamp-3">
                {hero.description || 'No description available.'}
              </p>
              <div className="flex gap-4">
                <Link 
                  href={`/${hero.type}/${hero.slug}`} 
                  className="bg-white text-black hover:bg-gray-200 transition-colors px-6 py-3 rounded font-semibold"
                >
                  Play Now
                </Link>
                <Link 
                  href={`/${hero.type}/${hero.slug}`} 
                  className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors px-6 py-3 rounded font-semibold"
                >
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 -mt-32 pb-16">
        {/* Genre Rows */}
        {genres.map((genre) => (
          <div key={genre.slug} className="mb-8 px-4 md:px-12">
            <div className="flex items-center justify-between mb-4">
              <Link href={`/genre/${genre.slug}`} className="text-white text-xl font-bold hover:text-red-500">
                {genre.name}
              </Link>
            </div>
          </div>
        ))}

        {/* Trending Row */}
        {trending.length > 0 && (
          <div className="mb-8 px-4 md:px-12">
            <div className="flex items-center justify-between mb-4">
              <Link href="/trending" className="text-white text-xl font-bold hover:text-red-500">
                Trending Now
              </Link>
            </div>
            <div className="relative">
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full hidden md:block"
              >
                ←
              </button>
              <div 
                ref={rowRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {trending.slice(0, 20).map((movie, i) => (
                  <Link
                    key={`${movie.slug}-${i}`}
                    href={`/${movie.type || 'movie'}/${movie.slug}`}
                    className="flex-shrink-0 w-40 md:w-48 group"
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
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full hidden md:block"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Top IMDb Row */}
        {topData.length > 0 && (
          <div className="mb-8 px-4 md:px-12">
            <div className="flex items-center justify-between mb-4">
              <Link href="/top-imdb" className="text-white text-xl font-bold hover:text-red-500">
                Top IMDb
              </Link>
            </div>
            <div className="relative">
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full hidden md:block"
              >
                ←
              </button>
              <div 
                ref={rowRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {topData.slice(0, 20).map((movie, i) => (
                  <Link
                    key={`${movie.slug}-${i}`}
                    href={`/${movie.type || 'movie'}/${movie.slug}`}
                    className="flex-shrink-0 w-40 md:w-48 group"
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
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full hidden md:block"
              >
                →
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="px-4 md:px-12">
            <div className="h-8 w-32 bg-zinc-800 rounded mb-4 skeleton" />
            <div className="flex gap-4 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-40 md:w-48">
                  <div className="aspect-[2/3] skeleton rounded-lg mb-2" />
                  <div className="h-4 w-32 skeleton rounded" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}