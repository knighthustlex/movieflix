'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getGenre, GenreResponse } from '@/lib/api';
import Link from 'next/link';

function GenreContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const genreSlug = params.slug as string;
  const page = parseInt(searchParams.get('page') || '1');
  const [data, setData] = useState<GenreResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getGenre(genreSlug, page).then((result) => {
      setData(result);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [genreSlug, page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 px-4 md:px-8 pb-16">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 capitalize">
        {data?.genre || genreSlug.replace(/-/g, ' ')}
      </h1>
      <p className="text-gray-400 mb-8">
        {data?.results?.length || 0} titles
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data?.results?.map((item, index) => (
          <Link 
            key={`${item.slug}-${index}`} 
            href={`/${item.type || 'movie'}/${item.slug}`}
            className="group"
          >
            <div className="aspect-[2/3] rounded-md overflow-hidden bg-zinc-800">
              <img 
                src={item.poster ? `https://image.tmdb.org/t/p/w300${item.poster}` : '/placeholder.jpg'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-white text-sm mt-2 truncate group-hover:text-red-500 transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <span>{item.year}</span>
              {item.rating > 0 && <span>★ {item.rating}</span>}
            </div>
          </Link>
        ))}
      </div>

      {data?.has_next_page && (
        <div className="flex justify-center mt-8">
          <Link 
            href={`/genre/${genreSlug}?page=${page + 1}`}
            className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Load More
          </Link>
        </div>
      )}
    </div>
  );
}

export default function GenrePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <GenreContent />
    </Suspense>
  );
}