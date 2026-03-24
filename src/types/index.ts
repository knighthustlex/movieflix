export interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  slug: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: string[];
  stream_sources: StreamSource[];
}

export interface StreamSource {
  name: string;
  embed_url: string;
  logo?: string;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface MovieItem {
  id: number;
  tmdb_id: number;
  title: string;
  slug: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  genres?: string[];
}

export interface GenreContent {
  genre: Genre;
  movies: MovieItem[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface HomeData {
  genres: Genre[];
  hero: MovieItem;
  trending: MovieItem[];
  top_imdb: MovieItem[];
  recent_movies: MovieItem[];
}

export interface SearchResults {
  results: MovieItem[];
  page: number;
  total_pages: number;
  total_results: number;
}