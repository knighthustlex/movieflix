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
      const scrollAmount = 400;
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
    <div className="px-4 md:px-8 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-white hover:text-red-500 transition-colors cursor-pointer">
          {title}
        </h2>
        {seeAllLink && (
          <Link href={seeAllLink} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1">
            See All <span>→</span>
          </Link>
        )}
      </div>
      
      <div className="relative group">
        {/* Left scroll button */}
        <button 
          onClick={() => scroll('left')} 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0 shadow-lg"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Movies scroll container */}
        <div 
          ref={scrollRef} 
          className="flex gap-3 overflow-x-scroll no-scrollbar pb-4 px-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {movies.map((movie, index) => (
            <Link 
              key={`${movie.slug}-${index}`} 
              href={`/${movie.type || 'movie'}/${movie.slug}`} 
              className="flex-shrink-0 w-36 md:w-44 hover-scale group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-zinc-800 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={getPosterUrl(movie)} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-sm font-semibold truncate mb-1">{movie.title}</h3>
                    <div className="flex items-center gap-2 text-gray-300 text-xs">
                      <span>{movie.year}</span>
                      {movie.rating > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-400 font-medium">★ {movie.rating}</span>
                        </>
                      )}
                    </div>
                    {movie.genres && movie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {movie.genres.slice(0, 2).map((genre, i) => (
                          <span key={i} className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Play button on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
                  <div className="bg-red-600 rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                
                {/* Rating badge */}
                {movie.rating >= 8 && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded shadow-md">
                    ★ {movie.rating}
                  </div>
                )}
                
                {/* Quality badge */}
                {movie.quality && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                    {movie.quality}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Right scroll button */}
        <button 
          onClick={() => scroll('right')} 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 shadow-lg"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}