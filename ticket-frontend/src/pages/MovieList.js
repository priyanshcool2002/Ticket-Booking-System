import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../api";
import { Link } from "react-router-dom";

export default function MovieList() {
  const {
    data: movies = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: getMovies,
    staleTime: 1000 * 60, // 1 min
    retry: 1
  });

  if (isLoading) return <div>Loading movies...</div>;
  if (isError) {
    console.error("Failed to fetch movies:", error);
    return <div>Failed to fetch movies</div>;
  }

  // DEBUG: inspect what we actually received
  // console.log("movies (from react-query):", movies);

  if (!Array.isArray(movies) || movies.length === 0) {
    return (
      <div>
        <h1>Available Movies</h1>
        <p>No movies available.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Available Movies</h1>
      <div className="movies-grid">
        {movies.map((m) => (
          <div key={m.id} className="card">
            <h3>{m.movieName}</h3>
            <p>Rating: {m.rating}</p>
            <p>Language: {m.language}</p>
            <Link to={`/movies/${m.id}`} className="btn">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}