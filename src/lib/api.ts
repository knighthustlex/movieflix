const BASE_URL = 'https://moviex-flip.vercel.app';

export interface Genre {
  name: string;
  slug: string;
  count: string;
  thumbnail: string;
}

export interface HeroItem {
  title: string;
  slug: string;
  type: 'movie' | 'tv';
  year: number;
  rating: number;
  quality: string;
  country: string;
  description: string;
  backdrop: string;
  logo: string;
}

export interface MovieItem {
  title: string;
  slug: string;
  year: number;
  rating: number;
  poster?: string;
  type?: string;
  genres?: string[];
  duration?: string;
  quality?: string;
}

export interface StreamSource {
  name: string;
  embed_url: string;
}

export interface HomeData {
  channel: string;
  creator: string;
  genres: Genre[];
  hero: HeroItem[];
}

export interface SearchResults {
  query: string;
  page: number;
  results: MovieItem[];
}

export interface GenreResponse {
  genre: string;
  page: number;
  has_next_page: boolean;
  results: MovieItem[];
}

export interface ListResponse {
  page: number;
  has_next_page: boolean;
  results: MovieItem[];
}

export interface MovieDetail {
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

export interface StreamResponse {
  type: string;
  tmdb_id: number;
  sources: StreamSource[];
}

// Check if we're on the server
const isServer = typeof window === 'undefined';

async function fetchAPI(endpoint: string) {
  // When on server, call directly to avoid proxy overhead
  // When on client, use the proxy to avoid CORS
  const url = isServer 
    ? `${BASE_URL}/${endpoint}`
    : `/api/proxy?endpoint=${endpoint}`;
    
  const res = await fetch(url, {
    next: { revalidate: 60 } // Cache for 60 seconds
  });
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function fetchHome(): Promise<HomeData> {
  return fetchAPI('home');
}

export async function searchMovies(query: string, page = 1): Promise<SearchResults> {
  return fetchAPI(`search?q=${encodeURIComponent(query)}&page=${page}`);
}

export async function getMovieDetail(slug: string): Promise<MovieDetail> {
  return fetchAPI(`movie/${slug}`);
}

export async function getTvDetail(slug: string): Promise<MovieDetail> {
  return fetchAPI(`tv/${slug}`);
}

export async function getGenre(genreSlug: string, page = 1): Promise<GenreResponse> {
  return fetchAPI(`genre/${genreSlug}?page=${page}`);
}

export async function getTrending(page = 1): Promise<ListResponse> {
  return fetchAPI(`trending?page=${page}`);
}

export async function getTopIMDb(page = 1): Promise<ListResponse> {
  return fetchAPI(`top-imdb?page=${page}`);
}

export const getTopImdb = getTopIMDb;

export async function getMovies(page = 1): Promise<ListResponse> {
  return fetchAPI(`movies?page=${page}`);
}

export async function getTvShows(page = 1): Promise<ListResponse> {
  return fetchAPI(`tv-shows?page=${page}`);
}

export async function getStreamSources(type: 'movie' | 'tv', id: string, season?: number, episode?: number): Promise<StreamResponse> {
  let endpoint = `stream/${type}/${id}`;
  if (type === 'tv' && season && episode) {
    endpoint += `/${season}/${episode}`;
  }
  return fetchAPI(endpoint);
}