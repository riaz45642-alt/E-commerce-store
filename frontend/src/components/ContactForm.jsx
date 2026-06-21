/**
 * ContactForm.jsx — Veyra Contact / Feedback Form
 * Lightweight, minimal validation, free-tier safe.
 * Uses contactApi from logic/api.js — no fetch() inside this component.
 */

import { useState } from "react";
import { contactApi } from "../logic/api";

const INK      = "#0B0B0E";
const PORCELAIN= "#F3EFE6";
const GOLD     = "#C9A227";
const SURFACE  = "rgba(255,255,255,0.04)";
const BORDER   = "rgba(255,255,255,0.08)";

const inputStyle = {
  width: "100%",
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: "0.6rem 0.85rem",
  color: PORCELAIN,
  fontSize: "0.8rem",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export default function ContactForm({ onClose }) {
  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email || !form.message) return;
    setStatus("sending");
    try {
      await contactApi.submit(form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>✓</p>
        <p style={{ color: GOLD, fontSize: "0.85rem", marginBottom: "0.25rem" }}>Message sent</p>
        <p style={{ color: "rgba(243,239,230,0.45)", fontSize: "0.75rem" }}>We'll get back to you soon.</p>
        {onClose && (
          <button
            onClick={onClose}
            style={{ marginTop: "1.25rem", background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "0.5rem 1.2rem", color: PORCELAIN, fontSize: "0.75rem", cursor: "pointer" }}
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <p style={{ fontSize: "0.65rem", color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
        Get in touch
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          type="text"
          placeholder="Your name (optional)"
          value={form.name}
          onChange={set("name")}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = GOLD + "66")}
          onBlur={(e)  => (e.target.style.borderColor = BORDER)}
        />
        <input
          type="email"
          placeholder="Email address *"
          value={form.email}
          onChange={set("email")}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = GOLD + "66")}
          onBlur={(e)  => (e.target.style.borderColor = BORDER)}
        />
        <textarea
          placeholder="Your message *"
          value={form.message}
          onChange={set("message")}
          rows={4}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          onFocus={(e) => (e.target.style.borderColor = GOLD + "66")}
          onBlur={(e)  => (e.target.style.borderColor = BORDER)}
        />
      </div>

      {status === "error" && (
        <p style={{ fontSize: "0.72rem", color: "#e74c3c", marginTop: "0.5rem" }}>
          Something went wrong — please try again.
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", alignItems: "center" }}>
        <button
          onClick={handleSubmit}
          disabled={!form.email || !form.message || status === "sending"}
          style={{
            padding: "0.6rem 1.4rem",
            background: form.email && form.message ? GOLD : "rgba(201,162,39,0.15)",
            color: form.email && form.message ? INK : "rgba(201,162,39,0.4)",
            border: `1px solid ${GOLD}`,
            borderRadius: 8,
            fontSize: "0.75rem",
            fontWeight: 500,
            cursor: form.email && form.message ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            letterSpacing: "0.04em",
          }}
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "rgba(243,239,230,0.4)", fontSize: "0.75rem", cursor: "pointer" }}
          >
            Cancel
          </button>
        )}
      </div>

      <p style={{ fontSize: "0.62rem", color: "rgba(243,239,230,0.25)", marginTop: "0.75rem" }}>
        * Required fields
      </p>
    </div>
  );
}
