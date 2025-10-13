import React from "react";
import { useLocation } from "react-router-dom";

export default function BookingConfirmation() {
  const { state } = useLocation();
  if (!state) return <div>No booking details found</div>;
  const b = state;

  return (
    <div>
      <h1>Booking Confirmed 🎉</h1>
      <p><b>Movie:</b> {b.movieName}</p>
      <p><b>Theatre:</b> {b.theaterName}</p>
      <p><b>Date:</b> {b.date}</p>
      <p><b>Time:</b> {b.time}</p>
      <p><b>Seats:</b> {b.bookedSeats}</p>
      <p><b>Total Price:</b> ₹{b.totalPrice}</p>
    </div>
  );
}