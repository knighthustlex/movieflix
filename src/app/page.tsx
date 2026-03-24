import { fetchHome, getTrending, getTopImdb, HomeData, MovieItem } from '@/lib/api';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';

async function getData() {
  try {
    const [home, trendingData, topData] = await Promise.all([
      fetchHome(),
      getTrending(1).catch(() => ({ results: [] })),
      getTopImdb(1).catch(() => ({ results: [] }))
    ]);
    
    return {
      home,
      trending: (trendingData as { results: MovieItem[] }).results || [],
      topData: (topData as { results: MovieItem[] }).results || []
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      home: null,
      trending: [],
      topData: []
    };
  }
}

export default async function Home() {
  const { home, trending, topData } = await getData();

  if (!home) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load content</p>
          <form>
            <button 
              formAction={async () => {
                'use server';
                // This triggers a server-side reload
              }}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Retry
            </button>
          </form>
        </div>
      </div>
    );
  }

  const heroItem = home.hero?.[0];

  return (
    <div className="bg-black min-h-screen">
      {heroItem && <Hero hero={heroItem} />}
      
      <div className="relative z-10 -mt-32 pb-16">
        {home.genres?.map((genre) => (
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
        
        {trending.length === 0 && topData.length === 0 && !home.hero && (
          <div className="text-white text-center py-16">
            <p>No content loaded. Please check your connection.</p>
          </div>
        )}
      </div>
    </div>
  );
}