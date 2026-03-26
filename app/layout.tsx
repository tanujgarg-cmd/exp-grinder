export const metadata = {
  title: 'EXP Grinder — Neon Sci-Fi Browser Game',
  description: 'Grind games, collect weapons, battle in PvP. A neon sci-fi browser RPG.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #020108; overflow-x: hidden; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #0a0a1a; }
          ::-webkit-scrollbar-thumb { background: #0ff; border-radius: 4px; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
