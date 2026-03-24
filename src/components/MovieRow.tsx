'use client';

import { MovieItem } from '@/lib/api';
import Link from 'next/link';
import { useRef } from 'react';

interface MovieRowProps {
  title: string;
  movies: MovieItem[];
  seeAllLink?: string;
}

export default function MovieRow({ title, movies, seeAllLink }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
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

  return (
    <div className="px-4 md:px-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-white">{title}</h2>
        {seeAllLink && (
          <Link href={seeAllLink} className="text-gray-400 hover:text-white text-sm transition-colors">
            See All →
          </Link>
        )}
      </div>
      
      <div className="relative group">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Movies scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-scroll no-scrollbar pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {movies.map((movie, index) => (
            <Link
              key={`${movie.slug}-${index}`}
              href={`/${movie.type || 'movie'}/${movie.slug}`}
              className="flex-shrink-0 w-40 md:w-48 hover-scale group"
            >
              <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-zinc-800">
                <img
                  src={getPosterUrl(movie)}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-sm font-medium truncate">{movie.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                      <span>{movie.year}</span>
                      {movie.rating > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-400">★ {movie.rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Rating badge */}
                {movie.rating >= 8 && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                    ★ {movie.rating}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}