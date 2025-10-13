import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MovieList from "./pages/MovieList";
import MovieDetail from "./pages/MovieDetail";
import BookTicket from "./pages/BookTicket";
import BookingConfirmation from "./pages/BookingConfirmation";
import AddUser from "./pages/AddUser";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/book" element={<BookTicket />} />
          <Route path="/booking/:id" element={<BookingConfirmation />} />
          <Route path="/register" element={<AddUser />} />
        </Routes>
      </main>
    </div>
  );
}