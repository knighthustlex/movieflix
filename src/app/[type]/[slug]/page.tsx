import { getMovieDetail, getTvDetail, MovieDetail } from '@/lib/api';
import Link from 'next/link';

async function getDetail(type: string, slug: string) {
  try {
    const detail = type === 'tv' ? await getTvDetail(slug) : await getMovieDetail(slug);
    return detail;
  } catch (error) {
    console.error('Failed to load:', error);
    return null;
  }
}

export default async function DetailPage({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const { type, slug } = await params;
  const movie = await getDetail(type, slug);

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Content not found</h1>
          <Link href="/" className="text-red-500 hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop ? `https://image.tmdb.org/t/p/original${movie.backdrop}` : null;
  const defaultSource = movie.stream_sources?.[0];

  return (
    <div className="min-h-screen bg-black">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="fixed inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${backdropUrl})` }} />
      )}
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 pt-32 px-4 md:px-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-64 md:w-80 rounded-lg overflow-hidden bg-zinc-800">
                <img 
                  src={movie.backdrop ? `https://image.tmdb.org/t/p/w500${movie.backdrop}` : '/placeholder.jpg'} 
                  alt={movie.title} 
                  className="w-full" 
                />
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
              <div className="flex items-center gap-4 mb-6 text-gray-400">
                <span>{movie.year}</span>
                {movie.runtime && <span>{movie.runtime}</span>}
                <span className="capitalize">{movie.type}</span>
              </div>
              
              {movie.description && (
                <p className="text-gray-300 mb-8 max-w-2xl">{movie.description}</p>
              )}
              
              {/* Stream Sources */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Watch Now</h3>
                
                {movie.stream_sources && movie.stream_sources.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {movie.stream_sources.map((source, i) => (
                        <a 
                          key={i}
                          href={source.embed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-full text-sm font-medium bg-zinc-800 text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                        >
                          {source.name} ▶
                        </a>
                      ))}
                    </div>
                    
                    {defaultSource && (
                      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                        <iframe 
                          src={defaultSource.embed_url} 
                          className="w-full h-full" 
                          allowFullScreen 
                          allow="autoplay; fullscreen"
                          title="Video Player"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400">No streaming sources available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}