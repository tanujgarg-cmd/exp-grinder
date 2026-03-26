"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function AuthCallback() {
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        window.location.href = "/";
      }
    });
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #020108 0%, #0a0015 30%, #050510 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Orbitron', sans-serif", color: "#0ff",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: 16, animation: "pulse 1s infinite" }}>⚡</div>
        <div>Logging you in...</div>
      </div>
    </div>
  );
}
