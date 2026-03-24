'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const BASE_URL = 'https://moviex-flip.vercel.app';

interface StreamSource {
  name: string;
  embed_url: string;
}

interface MovieDetail {
  slug: string;
  runtime: string;
  stream_sources: StreamSource[];
  backdrop: string;
  title: string;
  year: number;
  type: string;
  tmdb_id: string;
  description: string;
  flux_embed: string;
}

async function fetchAPI(endpoint: string) {
  const res = await fetch(`/api/proxy?endpoint=${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export default function DetailPage() {
  const params = useParams();
  const type = params.type as string;
  const slug = params.slug as string;
  
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<StreamSource | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!type || !slug) return;
      
      setLoading(true);
      try {
        const detail = type === 'tv' 
          ? await fetchAPI(`tv/${slug}`) 
          : await fetchAPI(`movie/${slug}`);
        
        setMovie(detail);
        
        if (detail.stream_sources?.length > 0) {
          setSelectedSource(detail.stream_sources[0]);
        }
      } catch (err) {
        console.error('Failed to load:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    }
    
    loadDetail();
  }, [type, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="h-[60vh] skeleton" />
        <div className="px-8 py-8 space-y-4">
          <div className="h-12 w-96 skeleton rounded" />
          <div className="h-6 w-64 skeleton rounded" />
          <div className="h-32 w-full skeleton rounded" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
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
                        <button 
                          key={i}
                          onClick={() => setSelectedSource(source)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedSource?.name === source.name 
                              ? 'bg-red-600 text-white' 
                              : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                          }`}
                        >
                          {source.name}
                        </button>
                      ))}
                    </div>
                    
                    {selectedSource && (
                      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                        <iframe 
                          src={selectedSource.embed_url} 
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