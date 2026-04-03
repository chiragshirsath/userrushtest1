import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BACKEND_URL, GAME_ID } from "../constants";

const supabase = createClient(
  window.APP_CONFIG.supabaseUrl,
  window.APP_CONFIG.supabaseAnonKey
);

export default function Game() {
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.background = "#0f172a";
    document.body.style.overflow = "hidden";

    const root = document.getElementById("root");
    if (root) {
      root.style.width = "100%";
      root.style.height = "100%";
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        window.location.href = "/";
        return;
      }
      const user = session.user;

      if (!user.email.endsWith("@iiitl.ac.in")) {
        alert("Use institute email (@iiitl.ac.in)");
        await supabase.auth.signOut();
        window.location.href = "/";
        return;
      }

      const token = session.access_token;

      await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameId: GAME_ID,
        }),
      });
    };

    init();
  }, []);

  // Game logic: move box every 800ms
  useEffect(() => {
    const moveBox = () => {
      setPos({
        x: Math.random() * 80,
        y: Math.random() * 80,
      });
    };

    const interval = setInterval(moveBox, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        background:
          "linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)",
        fontFamily: "Arial, sans-serif",
        color: "white",
        overflow: "hidden",
      }}
    >
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        🎯 Score: {score}
      </h1>

      <p style={{ textAlign: "center", color: "#cbd5e1" }}>
        Click the moving box!
      </p>

      <div
        onClick={() => setScore(score + 1)}
        style={{
          position: "absolute",
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: "60px",
          height: "60px",
          background: "#22c55e",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          userSelect: "none",
        }}
      >
        +1
      </div>
    </div>
  );
}
