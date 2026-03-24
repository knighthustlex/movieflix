'use client';

import { HeroItem } from '@/lib/api';
import Link from 'next/link';

interface HeroProps {
  hero: HeroItem;
}

export default function Hero({ hero }: HeroProps) {
  const imageUrl = hero.backdrop || hero.logo ? `https://image.tmdb.org/t/p/original${hero.backdrop}` : '/placeholder.jpg';
  
  return (
    <div className="relative h-[80vh] w-full">
      {/* Backdrop Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 pb-16 md:px-12 md:pb-24 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          {/* Logo/Title */}
          {hero.logo ? (
            <img 
              src={`https://image.tmdb.org/t/p/original${hero.logo}`}
              alt={hero.title}
              className="h-16 md:h-24 w-auto mb-6"
            />
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {hero.title}
            </h1>
          )}
          
          {/* Meta info */}
          <div className="flex items-center gap-4 mb-4 text-sm md:text-base">
            <span className="text-green-400 font-semibold">{hero.rating} Rating</span>
            <span className="text-gray-400">{hero.year}</span>
            <span className="text-gray-400">{hero.type === 'tv' ? 'TV Series' : 'Movie'}</span>
            {hero.quality && (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded">{hero.quality}</span>
            )}
            {hero.country && (
              <span className="text-gray-400">{hero.country}</span>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-300 text-sm md:text-lg mb-6 line-clamp-3">
            {hero.description || 'No description available.'}
          </p>
          
          {/* Buttons */}
          <div className="flex gap-4">
            <Link
              href={`/${hero.type}/${hero.slug}`}
              className="bg-white text-black hover:bg-gray-200 transition-colors px-6 py-3 rounded font-semibold flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play Now
            </Link>
            <Link
              href={`/${hero.type}/${hero.slug}`}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors px-6 py-3 rounded font-semibold flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}