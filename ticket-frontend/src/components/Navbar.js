import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/movies" className="brand">🎟 TicketSystem</Link>
      <div className="nav-links">
        <Link to="/movies">Movies</Link>
        <Link to="/book">Book Ticket</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}