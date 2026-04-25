"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("pick"); // pick, login, signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message === "Invalid login credentials" ? "Wrong email or password! Try again." : error.message);
    else window.location.href = "/";
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters!"); setLoading(false); return; }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setSignupSuccess(true);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #020108 0%, #0a0015 30%, #050510 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Share Tech Mono', monospace",
      padding: 20,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 420, borderRadius: 20,
        background: "linear-gradient(135deg, #0a0a2a, #0d1117, #0a0a2a)",
        border: "1px solid #1a1a3e",
        boxShadow: "0 0 60px #f0f08, 0 0 120px #0ff05",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "32px 24px 20px" }}>
          <div style={{ fontSize: "2.5rem", animation: "float 3s ease-in-out infinite", marginBottom: 8 }}>⚡</div>
          <div style={{
            fontSize: "2.2rem", fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
            background: "linear-gradient(90deg, #0ff, #f0f, #fbbf24)", WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", letterSpacing: 4,
          }}>EXP GRINDER</div>
        </div>

        <div style={{ padding: "0 28px 32px" }}>

          {/* ─── PICK MODE ─── */}
          {mode === "pick" && !signupSuccess && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ color: "#888", fontSize: "0.85rem", marginBottom: 4 }}>Welcome, Grinder!</div>
                <div style={{ color: "#555", fontSize: "0.7rem" }}>Choose one to get started:</div>
              </div>

              {/* New Player button */}
              <button onClick={() => { setMode("signup"); setError(""); }}
                style={{
                  width: "100%", padding: "18px 20px", marginBottom: 12,
                  display: "flex", alignItems: "center", gap: 14,
                  background: "linear-gradient(135deg, #0f015, #0a2a0a)",
                  border: "2px solid #0f060", borderRadius: 14, cursor: "pointer",
                  transition: "all 0.3s",
                }}>
                <div style={{
                  width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#0f020", borderRadius: 12, fontSize: "1.6rem",
                  border: "1px solid #0f050",
                }}>🆕</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{
                    color: "#0f0", fontSize: "1rem", fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700, textShadow: "0 0 10px #0f060",
                  }}>I'M NEW!</div>
                  <div style={{ color: "#6ee7b7", fontSize: "0.7rem", marginTop: 2 }}>
                    Create a free account to start playing
                  </div>
                </div>
              </button>

              {/* Returning Player button */}
              <button onClick={() => { setMode("login"); setError(""); }}
                style={{
                  width: "100%", padding: "18px 20px",
                  display: "flex", alignItems: "center", gap: 14,
                  background: "linear-gradient(135deg, #0ff08, #0a0a2a)",
                  border: "2px solid #0ff40", borderRadius: 14, cursor: "pointer",
                  transition: "all 0.3s",
                }}>
                <div style={{
                  width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#0ff10", borderRadius: 12, fontSize: "1.6rem",
                  border: "1px solid #0ff40",
                }}>🔑</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{
                    color: "#0ff", fontSize: "1rem", fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700, textShadow: "0 0 10px #0ff60",
                  }}>I HAVE AN ACCOUNT</div>
                  <div style={{ color: "#60a5fa", fontSize: "0.7rem", marginTop: 2 }}>
                    Log in with your email and password
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* ─── SIGNUP SUCCESS ─── */}
          {signupSuccess && (
            <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12, animation: "float 2s ease-in-out infinite" }}>📧</div>
              <div style={{
                color: "#0f0", fontSize: "1.2rem", fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700, marginBottom: 12, textShadow: "0 0 15px #0f040",
              }}>CHECK YOUR EMAIL!</div>

              <div style={{
                padding: 16, borderRadius: 12, marginBottom: 16,
                background: "#0f008", border: "1px solid #0f030", textAlign: "left",
              }}>
                <div style={{ color: "#ccc", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  We sent a confirmation link to:
                </div>
                <div style={{
                  color: "#0ff", fontSize: "0.95rem", fontFamily: "'Orbitron', sans-serif",
                  margin: "8px 0", wordBreak: "break-all", textAlign: "center",
                }}>{email}</div>
                <div style={{ color: "#ccc", fontSize: "0.85rem", lineHeight: 1.6, marginTop: 8 }}>
                  Open your email, find the message, and click the confirmation link. Then come back here and log in!
                </div>
              </div>

              <div style={{
                padding: 14, borderRadius: 10,
                background: "#fbbf2408", border: "1px solid #fbbf2430",
                marginBottom: 16, textAlign: "left",
              }}>
                <div style={{ color: "#fbbf24", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6 }}>
                  ⚠️ Can't find the email?
                </div>
                <div style={{ color: "#ccc", fontSize: "0.78rem", lineHeight: 1.6 }}>
                  1. Check your <span style={{ color: "#fbbf24", fontWeight: 700 }}>SPAM</span> or <span style={{ color: "#fbbf24", fontWeight: 700 }}>JUNK</span> folder<br />
                  2. Look for an email from <span style={{ color: "#0ff" }}>noreply@mail.app.supabase.io</span><br />
                  3. Subject line: <span style={{ color: "#0ff" }}>"Confirm your signup"</span>
                </div>
              </div>

              <button onClick={() => { setMode("login"); setSignupSuccess(false); setPassword(""); }}
                style={{
                  width: "100%", padding: 14, borderRadius: 10, cursor: "pointer",
                  background: "linear-gradient(135deg, #0ff15, #0a0a2a)",
                  border: "2px solid #0ff50", color: "#0ff",
                  fontSize: "0.95rem", fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                }}>
                ✅ I CONFIRMED — LET ME LOG IN
              </button>
            </div>
          )}

          {/* ─── LOGIN FORM ─── */}
          {mode === "login" && !signupSuccess && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ color: "#0ff", fontSize: "1.1rem", fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>
                  🔑 WELCOME BACK
                </div>
                <div style={{ color: "#555", fontSize: "0.7rem", marginTop: 4 }}>Enter your email and password</div>
              </div>

              {error && (
                <div style={{
                  padding: 12, marginBottom: 14, borderRadius: 10,
                  background: "#f4410", border: "1px solid #f4440", color: "#f44",
                  fontSize: "0.8rem", textAlign: "center",
                }}>❌ {error}</div>
              )}

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ color: "#888", fontSize: "0.65rem", display: "block", marginBottom: 4 }}>EMAIL</label>
                  <input type="email" placeholder="your@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                    style={{
                      width: "100%", padding: 14, borderRadius: 10,
                      background: "#05050f", border: "1px solid #0ff30", color: "#fff",
                      fontSize: "0.95rem", fontFamily: "'Share Tech Mono', monospace", outline: "none",
                    }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: "#888", fontSize: "0.65rem", display: "block", marginBottom: 4 }}>PASSWORD</label>
                  <input type="password" placeholder="Enter your password" value={password}
                    onChange={(e) => setPassword(e.target.value)} required
                    style={{
                      width: "100%", padding: 14, borderRadius: 10,
                      background: "#05050f", border: "1px solid #0ff30", color: "#fff",
                      fontSize: "0.95rem", fontFamily: "'Share Tech Mono', monospace", outline: "none",
                    }} />
                </div>
                <button type="submit" disabled={loading} style={{
                  width: "100%", padding: 16, borderRadius: 12, cursor: loading ? "wait" : "pointer",
                  background: "linear-gradient(135deg, #0ff20, #0a0a2a)",
                  border: "2px solid #0ff60", color: "#0ff",
                  fontSize: "1.1rem", fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                  textShadow: "0 0 10px #0ff60",
                  animation: loading ? "pulse 0.8s infinite" : "none",
                }}>
                  {loading ? "LOGGING IN..." : "⚡ LOGIN"}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button onClick={() => { setMode("pick"); setError(""); setEmail(""); setPassword(""); }}
                  style={{
                    background: "none", border: "none", color: "#888", cursor: "pointer",
                    fontSize: "0.75rem", fontFamily: "'Share Tech Mono', monospace",
                  }}>← Go back</button>
              </div>
            </div>
          )}

          {/* ─── SIGNUP FORM ─── */}
          {mode === "signup" && !signupSuccess && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ color: "#0f0", fontSize: "1.1rem", fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>
                  🆕 CREATE ACCOUNT
                </div>
                <div style={{ color: "#555", fontSize: "0.7rem", marginTop: 4 }}>Pick an email and password to get started</div>
              </div>

              {error && (
                <div style={{
                  padding: 12, marginBottom: 14, borderRadius: 10,
                  background: "#f4410", border: "1px solid #f4440", color: "#f44",
                  fontSize: "0.8rem", textAlign: "center",
                }}>❌ {error}</div>
              )}

              <form onSubmit={handleSignup}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ color: "#888", fontSize: "0.65rem", display: "block", marginBottom: 4 }}>YOUR EMAIL</label>
                  <input type="email" placeholder="your@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                    style={{
                      width: "100%", padding: 14, borderRadius: 10,
                      background: "#05050f", border: "1px solid #0f030", color: "#fff",
                      fontSize: "0.95rem", fontFamily: "'Share Tech Mono', monospace", outline: "none",
                    }} />
                </div>
                <div style={{ marginBottom: 6 }}>
                  <label style={{ color: "#888", fontSize: "0.65rem", display: "block", marginBottom: 4 }}>CREATE A PASSWORD</label>
                  <input type="password" placeholder="At least 6 characters" value={password}
                    onChange={(e) => setPassword(e.target.value)} required minLength={6}
                    style={{
                      width: "100%", padding: 14, borderRadius: 10,
                      background: "#05050f", border: "1px solid #0f030", color: "#fff",
                      fontSize: "0.95rem", fontFamily: "'Share Tech Mono', monospace", outline: "none",
                    }} />
                </div>
                <div style={{ color: "#555", fontSize: "0.6rem", marginBottom: 16, paddingLeft: 4 }}>
                  💡 Remember this password — you'll need it to log in!
                </div>
                <button type="submit" disabled={loading} style={{
                  width: "100%", padding: 16, borderRadius: 12, cursor: loading ? "wait" : "pointer",
                  background: "linear-gradient(135deg, #0f015, #0a2a0a)",
                  border: "2px solid #0f060", color: "#0f0",
                  fontSize: "1.1rem", fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                  textShadow: "0 0 10px #0f060",
                  animation: loading ? "pulse 0.8s infinite" : "none",
                }}>
                  {loading ? "CREATING..." : "🚀 CREATE MY ACCOUNT"}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button onClick={() => { setMode("pick"); setError(""); setEmail(""); setPassword(""); }}
                  style={{
                    background: "none", border: "none", color: "#888", cursor: "pointer",
                    fontSize: "0.75rem", fontFamily: "'Share Tech Mono', monospace",
                  }}>← Go back</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
