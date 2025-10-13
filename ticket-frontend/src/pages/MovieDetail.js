import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovie } from "../api";

/**
 * MovieDetail page
 *
 * - Robustly handles different backend shapes:
 *   - Axios response with .data as object
 *   - .data as a JSON string (previous issue)
 * - Shows fallback text when nested fields are missing
 * - Adds a quick "View Seats / Book" button that navigates to /book?showId=...
 *
 * Paste this whole file (replace existing MovieDetail.js).
 */
export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: movie, isLoading, isError, error } = useQuery({
    queryKey: ["movie", id],
    enabled: !!id, // don't run until id exists
    retry: 1,
    queryFn: async () => {
      // call the API helper and normalize the returned payload to a plain object
      const res = await getMovie(id);
      let payload = res?.data ?? res; // handle both axios response and raw payload
      if (typeof payload === "string") {
        // backend was previously returning a JSON string — parse it
        try {
          payload = JSON.parse(payload);
        } catch (e) {
          console.error("Failed to parse movie JSON string:", e);
          // return null so UI shows an appropriate message
          return null;
        }
      }
      return payload;
    },
  });

  if (!id) return <div style={{ padding: 24 }}>No movie id provided.</div>;
  if (isLoading) return <div style={{ padding: 24 }}>Loading movie...</div>;
  if (isError) {
    console.error("MovieDetail error:", error);
    return <div style={{ padding: 24 }}>Failed to load movie.</div>;
  }
  if (!movie) return <div style={{ padding: 24 }}>No movie data available.</div>;

  // In case the backend still returns an Axios-like wrapper for some reason
  const normalizedMovie = movie?.data ?? movie;

  return (
    <div style={{ padding: 24 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        ← Back
      </button>

      <h1>{normalizedMovie.movieName ?? "Untitled movie"}</h1>
      <p>Rating: {normalizedMovie.rating ?? "N/A"}</p>
      <p>Duration: {normalizedMovie.duration ? `${normalizedMovie.duration} mins` : "N/A"}</p>
      <p>Release date: {normalizedMovie.releaseDate ?? "N/A"}</p>
      <p>Language: {normalizedMovie.language ?? "N/A"}</p>

      <h3>Shows</h3>
      {Array.isArray(normalizedMovie.shows) && normalizedMovie.shows.length > 0 ? (
        <ul>
          {normalizedMovie.shows.map((s) => (
            <li key={s.showId} style={{ marginBottom: 8 }}>
              {s.date ?? "unknown date"} @ {s.time ?? "unknown time"} — Theater:{" "}
              {s.theater?.name ?? "Unknown"} (showId: {s.showId ?? "—"})
              <button
                style={{ marginLeft: 12 }}
                onClick={() => navigate(`/book?showId=${s.showId || ""}`)}
              >
                View Seats / Book
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No shows available for this movie.</p>
      )}
    </div>
  );
}