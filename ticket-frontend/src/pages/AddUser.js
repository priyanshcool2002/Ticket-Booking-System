// src/pages/AddUser.js
import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    age: "",
    address: "",
    mobileNo: "",
    emailId: "",
    gender: "MALE",
    roles: "USER"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "error"|"success", text }

  const handleChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    // prepare payload exactly as backend expects
    const payload = {
      name: user.name,
      age: user.age ? Number(user.age) : null,
      address: user.address,
      mobileNo: user.mobileNo,
      emailId: user.emailId,
      gender: user.gender,
      roles: user.roles
    };

    console.log("Register payload:", payload);

    try {
      const res = await registerUser(payload);
      console.log("Register response:", res);
      // if backend returns a simple string or object, show it
      const text = res?.data ?? "Registration successful";
      setMessage({ type: "success", text: String(text) });
      // navigate to movies or login after short pause
      setTimeout(() => navigate("/movies"), 800);
    } catch (err) {
      console.error("Register error (full):", err);
      // Try to extract a helpful message from axios error shape
      const status = err?.response?.status;
      const data = err?.response?.data;
      let text = "Registration failed";

      if (data) {
        if (typeof data === "string") text = data;
        else if (data.message) text = data.message;
        else text = JSON.stringify(data);
      } else if (err.message) {
        text = err.message;
      }

      setMessage({ type: "error", text: `Error${status ? ` (${status})` : ""}: ${text}` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Register User</h1>

      {message && (
        <div
          style={{
            marginBottom: 16,
            padding: 10,
            borderRadius: 6,
            background: message.type === "error" ? "#fee2e2" : "#ecfdf5",
            color: message.type === "error" ? "#7a0b0b" : "#064e3b",
          }}
        >
          {message.text}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
          required
        />
        <br /><br />
        <input
          name="age"
          placeholder="Age"
          value={user.age}
          onChange={handleChange}
          inputMode="numeric"
        />
        <br /><br />
        <input
          name="address"
          placeholder="Address"
          value={user.address}
          onChange={handleChange}
        />
        <br /><br />
        <input
          name="mobileNo"
          placeholder="Mobile"
          value={user.mobileNo}
          onChange={handleChange}
        />
        <br /><br />
        <input
          name="emailId"
          placeholder="Email"
          value={user.emailId}
          onChange={handleChange}
          type="email"
          required
        />
        <br /><br />
        <select name="gender" value={user.gender} onChange={handleChange}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <br /><br />
        <button className="btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}