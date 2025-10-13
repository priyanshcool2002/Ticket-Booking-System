import React, { useState, useEffect } from "react";
import { bookTicket } from "../api";
import { useNavigate, useLocation } from "react-router-dom";

export default function BookTicket() {
  const navigate = useNavigate();
  const location = useLocation();

  // try to read showId from query string ?showId=123
  const params = new URLSearchParams(location.search);
  const initialShowId = params.get("showId") || "";

  const [ticket, setTicket] = useState({
    showId: initialShowId,
    userId: "",
    requestSeats: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialShowId) setTicket((t) => ({ ...t, showId: initialShowId }));
  }, [initialShowId]);

  const handleChange = (e) =>
    setTicket({ ...ticket, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    // validation
    if (!ticket.showId || !ticket.userId || !ticket.requestSeats) {
      alert("Please fill showId, userId and seat(s)");
      return;
    }

    const payload = {
      showId: Number(ticket.showId),
      userId: Number(ticket.userId),
      requestSeats: ticket.requestSeats.split(",").map((s) => s.trim())
    };

    try {
      setLoading(true);
      const booking = await bookTicket(payload); // api.js unwraps .data already
      // if backend returns object, booking is object; if it returns wrapper, adjust
      // show success page with data
      navigate("/booking/" + (booking?.movieName || ""), { state: booking });
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Book Ticket</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          name="showId"
          placeholder="Show ID"
          value={ticket.showId}
          onChange={handleChange}
          required
        />
        <input
          name="userId"
          placeholder="User ID"
          value={ticket.userId}
          onChange={handleChange}
          required
        />
        <input
          name="requestSeats"
          placeholder="Seats (comma separated e.g. A1,A2)"
          value={ticket.requestSeats}
          onChange={handleChange}
          required
        />
        <button className="btn" disabled={loading}>
          {loading ? "Booking..." : "Book Ticket"}
        </button>
      </form>
    </div>
  );
}