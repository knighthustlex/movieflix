import { fetchHome, getTrending, getTopImdb, HomeData, MovieItem } from '@/lib/api';
import MovieRow from '@/components/MovieRow';
import Link from 'next/link';

async function getData() {
  try {
    // Add timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const [home, trendingData, topData] = await Promise.all([
      fetchHome(),
      getTrending(1).catch(() => ({ results: [] })),
      getTopImdb(1).catch(() => ({ results: [] }))
    ]).finally(() => clearTimeout(timeout));
    
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
        </div>
      </div>
    );
  }

  const heroItem = home.hero?.[0];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      {heroItem && (
        <div className="relative h-[80vh] w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: heroItem.backdrop ? `url(https://image.tmdb.org/t/p/original${heroItem.backdrop})` : 'none',
              filter: 'brightness(0.4)'
            }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end h-full px-4 pb-16 md:px-12 md:pb-24 max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{heroItem.title}</h1>
              <div className="flex items-center gap-4 mb-4 text-sm md:text-base">
                <span className="text-green-400 font-semibold">{heroItem.rating} Rating</span>
                <span className="text-gray-400">{heroItem.year}</span>
                <span className="text-gray-400">{heroItem.type === 'tv' ? 'TV Series' : 'Movie'}</span>
              </div>
              <p className="text-gray-300 text-sm md:text-lg mb-6 line-clamp-3">
                {heroItem.description || 'No description available.'}
              </p>
              <div className="flex gap-4">
                <Link 
                  href={`/${heroItem.type}/${heroItem.slug}`} 
                  className="bg-white text-black hover:bg-gray-200 transition-colors px-6 py-3 rounded font-semibold"
                >
                  Play Now
                </Link>
                <Link 
                  href={`/${heroItem.type}/${heroItem.slug}`} 
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
            <p>No content loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
}