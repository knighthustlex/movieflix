'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
  description: string;
  flux_embed: string;
  error?: string;
}

async function fetchAPI(endpoint: string): Promise<MovieDetail> {
  console.log('[API] Fetching:', endpoint);
  const res = await fetch(`/api/proxy?endpoint=${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const data = await res.json();
  console.log('[API] Got data, stream_sources length:', data.stream_sources?.length);
  return data;
}

export default function DetailPage() {
  const params = useParams();
  const type = params?.type as string | undefined;
  const slug = params?.slug as string | undefined;
  
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<StreamSource | null>(null);
  const [videoError, setVideoError] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log('[DEBUG] Params:', params);
    console.log('[DEBUG] Type:', type, 'Slug:', slug);
  }, [params, type, slug]);

  // Load movie data
  useEffect(() => {
    if (!slug) {
      console.log('[DEBUG] No slug, returning');
      return;
    }

    async function loadDetail() {
      console.log('[DEBUG] Loading detail for:', slug);
      setLoading(true);
      setError(null);
      
      try {
        const endpoint = type === 'tv' ? `tv/${slug}` : `movie/${slug}`;
        const detail = await fetchAPI(endpoint);
        
        console.log('[DEBUG] Detail loaded:', detail.title, 'sources:', detail.stream_sources?.length);
        
        if (detail.error) {
          setError(detail.error);
          return;
        }
        
        setMovie(detail);
        
        // Set first source immediately
        if (detail.stream_sources && detail.stream_sources.length > 0) {
          console.log('[DEBUG] Setting source to:', detail.stream_sources[0].name);
          setSelectedSource(detail.stream_sources[0]);
        } else if (detail.flux_embed) {
          console.log('[DEBUG] Setting fallback source to flux_embed');
          setSelectedSource({ name: 'Flux', embed_url: detail.flux_embed });
        }
      } catch (err) {
        console.error('[DEBUG] Failed to load:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    }
    
    loadDetail();
  }, [type, slug]);

  console.log('[DEBUG] RENDER - Movie:', movie?.title, 'Loading:', loading, 'Selected:', selectedSource?.name, 'HasIframe:', !!selectedSource);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="h-[60vh] skeleton" />
        <div className="px-8 py-8 space-y-4">
          <div className="h-12 w-96 skeleton rounded" />
          <div className="h-6 w-64 skeleton rounded" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">{error || 'Content not found'}</h1>
          <p className="text-gray-400 mb-4">Slug: {slug}</p>
          <Link href="/" className="text-red-500 hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Debug info */}
      <div className="fixed top-0 right-0 bg-red-600 text-white text-xs p-2 z-50">
        DEBUG: {movie.title} | Sources: {movie.stream_sources?.length || 0} | Selected: {selectedSource?.name || 'NONE'}
      </div>
      
      {/* Backdrop */}
      {movie.backdrop && (
        <div 
          className="fixed inset-0 bg-cover bg-center opacity-30" 
          style={{ backgroundImage: `url(${movie.backdrop})` }} 
        />
      )}
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      
      <div className="relative z-10 pt-32 px-4 md:px-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-64 md:w-80 rounded-lg overflow-hidden bg-zinc-800 shadow-2xl">
                {movie.backdrop && (
                  <img src={movie.backdrop.replace('/original', '/w500')} alt={movie.title} className="w-full" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
              <div className="flex items-center gap-4 mb-6 text-gray-400">
                <span>{movie.year}</span>
                {movie.runtime && <span>• {movie.runtime}</span>}
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
                          onClick={() => {
                            console.log('[DEBUG] Clicked source:', source.name);
                            setSelectedSource(source);
                            setVideoError(false);
                          }}
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
                    
                    {/* Video Player */}
                    {selectedSource && (
                      <div className="w-full bg-black rounded-lg overflow-hidden border border-zinc-800">
                        <div className="aspect-video w-full bg-black relative">
                          {videoError ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
                              <p className="text-red-400 mb-2">Failed to load video</p>
                              <button onClick={() => setVideoError(false)} className="px-4 py-2 bg-red-600 rounded">Retry</button>
                            </div>
                          ) : (
                            <iframe
                              key={selectedSource.embed_url}
                              src={selectedSource.embed_url}
                              className="w-full h-full absolute inset-0"
                              allowFullScreen
                              allow="autoplay; fullscreen; encrypted-media"
                              title="Player"
                            />
                          )}
                        </div>
                        <div className="p-3 bg-zinc-900 text-center">
                          <span className="text-gray-400">Playing: {selectedSource.name}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-zinc-800 rounded-lg p-6 text-center">
                    <p className="text-gray-400">No streaming sources available</p>
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