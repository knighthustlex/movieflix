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

export async function fetchHome(): Promise<HomeData> {
  const res = await fetch(`${BASE_URL}/home`);
  return res.json();
}

export async function searchMovies(query: string, page = 1): Promise<SearchResults> {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}`);
  return res.json();
}

export async function getMovieDetail(slug: string): Promise<MovieDetail> {
  const res = await fetch(`${BASE_URL}/movie/${slug}`);
  return res.json();
}

export async function getTvDetail(slug: string): Promise<MovieDetail> {
  const res = await fetch(`${BASE_URL}/tv/${slug}`);
  return res.json();
}

export async function getGenre(genreSlug: string, page = 1): Promise<GenreResponse> {
  const res = await fetch(`${BASE_URL}/genre/${genreSlug}?page=${page}`);
  return res.json();
}

export async function getTrending(page = 1): Promise<ListResponse> {
  const res = await fetch(`${BASE_URL}/trending?page=${page}`);
  return res.json();
}

export async function getTopIMDb(page = 1): Promise<ListResponse> {
  const res = await fetch(`${BASE_URL}/top-imdb?page=${page}`);
  return res.json();
}
// Alias for backwards compatibility
export const getTopImdb = getTopIMDb;

export async function getMovies(page = 1): Promise<ListResponse> {
  const res = await fetch(`${BASE_URL}/movies?page=${page}`);
  return res.json();
}

export async function getTvShows(page = 1): Promise<ListResponse> {
  const res = await fetch(`${BASE_URL}/tv-shows?page=${page}`);
  return res.json();
}

export async function getStreamSources(type: 'movie' | 'tv', id: string, season?: number, episode?: number): Promise<StreamResponse> {
  let url = `${BASE_URL}/stream/${type}/${id}`;
  if (type === 'tv' && season && episode) {
    url += `/${season}/${episode}`;
  }
  const res = await fetch(url);
  return res.json();
}