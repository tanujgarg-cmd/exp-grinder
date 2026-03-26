"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import XPGrinder from "@/components/XPGrinder";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      // Load saved game state
      const { data } = await supabase
        .from("players")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setGameState(data.game_state);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const saveGame = async (state) => {
    if (!user) return;
    await supabase
      .from("players")
      .upsert({
        user_id: user.id,
        email: user.email,
        game_state: state,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #020108 0%, #0a0015 30%, #050510 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Orbitron', sans-serif", color: "#0ff",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>⚡</div>
          <div>LOADING EXP GRINDER...</div>
        </div>
      </div>
    );
  }

  return (
    <XPGrinder
      user={user}
      initialState={gameState}
      onSave={saveGame}
      onLogout={handleLogout}
    />
  );
}
