'use client';
import { useState, useEffect } from 'react';
import { fetchHome, getTrending, getTopImdb, HomeData, MovieItem } from '@/lib/api';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import Link from 'next/link';

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [trending, setTrending] = useState<MovieItem[]>([]);
  const [topData, setTopData] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [home, trendingData, topDataResult] = await Promise.all([
          fetchHome(),
          getTrending(1),
          getTopImdb(1)
        ]);
        setHomeData(home);
        setTrending(trendingData.results || []);
        setTopData(topDataResult.results || []);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Loading MovieFlix...</p>
        </div>
      </div>
    );
  }

  const heroItem = homeData?.hero?.[0];

  return (
    <div className="bg-black min-h-screen">
      {heroItem && <Hero hero={heroItem} />}
      
      <div className="relative z-10 -mt-32 pb-16">
        {homeData?.genres?.map((genre) => (
          <MovieRow 
            key={genre.slug} 
            title={genre.name} 
            movies={[]} 
            seeAllLink={`/genre/${genre.slug}`}
          />
        ))}
        
        {trending.length > 0 && (
          <MovieRow 
            title="Trending Now" 
            movies={trending} 
            seeAllLink="/trending"
          />
        )}
        
        {topData.length > 0 && (
          <MovieRow 
            title="Top IMDb" 
            movies={topData} 
            seeAllLink="/top-imdb"
          />
        )}
      </div>
    </div>
  );
}