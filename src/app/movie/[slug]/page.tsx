'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getMovieDetail, getStreamSources, MovieDetail, StreamResponse } from '@/lib/api';

export default function MoviePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [streamData, setStreamData] = useState<StreamResponse | null>(null);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getMovieDetail(slug).then((data) => {
        setMovie(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [slug]);

  const handleSourceClick = async (embedUrl: string, sourceName: string) => {
    setActiveSource(sourceName);
    // Extract the ID from embed URL for stream
    const match = embedUrl.match(/\/embed\/([^?]+)/);
    if (match) {
      try {
        const stream = await getStreamSources('movie', match[1]);
        setStreamData(stream);
      } catch (e) {
        console.error('Error fetching stream:', e);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Movie not found</p>
      </div>
    );
  }

  const backdropUrl = movie.backdrop ? `https://image.tmdb.org/t/p/original${movie.backdrop}` : null;

  return (
    <div className="min-h-screen bg-black">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-[60vh] md:h-[70vh]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})`, filter: 'brightness(0.3)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative -mt-48 md:-mt-64 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img 
                src={movie.backdrop ? `https://image.tmdb.org/t/p/w500${movie.backdrop}` : '/placeholder.jpg'}
                alt={movie.title}
                className="w-48 md:w-64 rounded-lg shadow-2xl"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.runtime}</span>
                <span>•</span>
                <span className="capitalize">{movie.type}</span>
              </div>
              
              <p className="text-gray-300 text-lg mb-8">{movie.description}</p>

              {/* Stream Sources */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Watch Now</h2>
                <div className="flex flex-wrap gap-3">
                  {movie.stream_sources?.map((source, index) => (
                    <button
                      key={index}
                      onClick={() => handleSourceClick(source.embed_url, source.name)}
                      className={`px-4 py-2 rounded-full font-medium transition-colors ${
                        activeSource === source.name 
                          ? 'bg-red-600 text-white' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {source.name}
                    </button>
                  ))}
                </div>

                {/* Video Player */}
                {streamData?.sources && streamData.sources.length > 0 && (
                  <div className="mt-6">
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                      <iframe
                        src={streamData.sources[0].embed_url}
                        className="w-full h-full"
                        allowFullScreen
                        allow="fullscreen"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}