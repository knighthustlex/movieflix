'use client';

import { useState, useEffect } from 'react';
import { fetchHome, getTrending, getTopImdb, HomeData, MovieItem } from '@/lib/api';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [trending, setTrending] = useState<MovieItem[]>([]);
  const [topData, setTopData] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        console.log('Loading home data...');
        const home = await fetchHome();
        console.log('Home data:', home);
        setHomeData(home);
        
        try {
          const trendingData = await getTrending(1);
          console.log('Trending data:', trendingData);
          setTrending(trendingData.results || []);
        } catch (e) {
          console.error('Trending error:', e);
        }
        
        try {
          const topDataResult = await getTopImdb(1);
          console.log('Top IMDb data:', topDataResult);
          setTopData(topDataResult.results || []);
        } catch (e) {
          console.error('Top IMDb error:', e);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load');
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

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Retry
          </button>
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
          <MovieRow title="Trending Now" movies={trending} seeAllLink="/trending" />
        )}
        
        {topData.length > 0 && (
          <MovieRow title="Top IMDb" movies={topData} seeAllLink="/top-imdb" />
        )}
        
        {trending.length === 0 && topData.length === 0 && !homeData?.hero && (
          <div className="text-white text-center py-16">
            <p>No content loaded. Please check your connection.</p>
          </div>
        )}
      </div>
    </div>
  );
}