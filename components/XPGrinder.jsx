"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email for a confirmation link!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #020108 0%, #0a0015 30%, #050510 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Share Tech Mono', monospace",
    }}>
      <div style={{
        width: "100%", maxWidth: 400, padding: 32,
        background: "linear-gradient(135deg, #0a0a2a, #0d1117)",
        border: "1px solid #1a1a3e", borderRadius: 16,
        boxShadow: "0 0 40px #f0f10, 0 0 80px #0ff05",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontSize: "2rem", fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
            background: "linear-gradient(90deg, #0ff, #f0f)", WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", letterSpacing: 4,
          }}>EXP GRINDER</div>
          <div style={{ color: "#555", fontSize: "0.75rem", marginTop: 8 }}>
            {isSignup ? "CREATE YOUR ACCOUNT" : "LOGIN TO PLAY"}
          </div>
        </div>

        {error && (
          <div style={{ padding: 12, marginBottom: 16, borderRadius: 8, background: "#f4410", border: "1px solid #f4430", color: "#f44", fontSize: "0.8rem" }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ padding: 12, marginBottom: 16, borderRadius: 8, background: "#0f010", border: "1px solid #0f030", color: "#0f0", fontSize: "0.8rem" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleEmailAuth}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            required style={{
              width: "100%", padding: 14, marginBottom: 12, borderRadius: 8,
              background: "#05050f", border: "1px solid #1a1a3e", color: "#fff",
              fontSize: "0.9rem", fontFamily: "'Share Tech Mono', monospace",
              outline: "none",
            }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            required minLength={6} style={{
              width: "100%", padding: 14, marginBottom: 16, borderRadius: 8,
              background: "#05050f", border: "1px solid #1a1a3e", color: "#fff",
              fontSize: "0.9rem", fontFamily: "'Share Tech Mono', monospace",
              outline: "none",
            }} />
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: 14, borderRadius: 8, cursor: loading ? "wait" : "pointer",
            background: "linear-gradient(135deg, #0ff20, #f0f20)",
            border: "1px solid #0ff60", color: "#0ff",
            fontSize: "1rem", fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
            transition: "all 0.3s",
          }}>
            {loading ? "..." : isSignup ? "SIGN UP" : "LOGIN"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={() => { setIsSignup(!isSignup); setError(""); setMessage(""); }}
            style={{
              background: "none", border: "none", color: "#0ff", cursor: "pointer",
              fontSize: "0.8rem", fontFamily: "'Share Tech Mono', monospace",
            }}>
            {isSignup ? "Already have an account? Login" : "Need an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
