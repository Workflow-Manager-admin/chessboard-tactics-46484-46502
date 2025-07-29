"use client";
import { useState } from "react";

/**
 * Unicode symbols for Horses and Pawns.
 */
const HORSE = "♞";
const PAWN = "♙";

// Colors from design system
const COLORS = {
  accent: "#f59e42",    // for winner highlight
  primary: "#3b82f6",   // horses
  secondary: "#10b981", // pawns
};

/**
 * Calculates winner of tic tac toe.
 * @param board Array of 9 elements: "H", "P", or null
 * @returns "H" | "P" | null
 */
// PUBLIC_INTERFACE
function checkWinner(board: Array<"H" | "P" | null>): "H" | "P" | null {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diagonals
  ];
  for (const [a,b,c] of wins) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function isDraw(board: Array<"H" | "P" | null>) {
  return board.every(cell => cell !== null) && !checkWinner(board);
}

/**
 * Minimal Chess Icon for Horses and Pawns
 */
function ChessIcon({kind, color, size=48}:{kind: "H"|"P", color: string, size?: number}) {
  return (
    <span
      aria-label={kind === "H" ? "Horse" : "Pawn"}
      style={{
        fontSize: size,
        color,
        lineHeight: 1,
        display: "inline-block",
        filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.02))",
        userSelect: "none"
      }}
    >
      {kind === "H" ? HORSE : PAWN}
    </span>
  );
}

/**
 * Main Game Component
 */
export default function Home() {
  // 'H' = Horse (X, goes first), 'P' = Pawn (O)
  const [board, setBoard] = useState<Array<"H"|"P"|null>>(Array(9).fill(null));
  const [player, setPlayer] = useState<"H"|"P">("H");
  const winner = checkWinner(board);
  const draw = isDraw(board);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx: number) {
    if (board[idx] !== null || winner) return; // ignore filled or finished
    const update = [...board];
    update[idx] = player;
    setBoard(update);
    setPlayer(player === "H" ? "P" : "H");
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(9).fill(null));
    setPlayer("H");
  }

  // Status Message
  let message = "";
  if(winner) {
    message = winner === "H"
      ? "Horse wins! (♞)"
      : "Pawn wins! (♙)";
  } else if(draw) {
    message = "It's a draw!";
  } else {
    message = player === "H" ? "Horse’s turn (♞)" : "Pawn’s turn (♙)";
  }

  // Responsive board size
  // On mobile: fit to width
  // On desktop: max 400px
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-[var(--background)] font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-xs sm:max-w-md flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 tracking-tight" style={{color:COLORS.primary, letterSpacing:0.5}}>
          Horses vs Pawns
        </h1>
        <p className="text-sm mb-6 text-gray-600 text-center" style={{maxWidth:320}}>
          Tic tac toe — Modern. Minimal. Play with horses (<b>♞</b>) and pawns (<b>♙</b>).
        </p>
        <div
          className="mb-6"
          aria-live="polite"
        >
          <span
            className="text-lg font-semibold"
            style={{
              color: winner ? COLORS.accent :
                    player === "H" ? COLORS.primary : COLORS.secondary
            }}
          >
            {message}
          </span>
        </div>
        <div className="w-full aspect-square">
          <div
            className="grid grid-cols-3 grid-rows-3 gap-[1vmin] sm:gap-2 w-full h-full rounded-xl bg-gray-200"
            style={{boxShadow:"0 2px 8px 0 rgba(0,0,0,0.03)"}}
            role="grid"
          >
            {board.map((cell, i) => {
              const isWinning = (() => {
                if (!winner) return false;
                // Find winning combination
                const winning = [
                  [0,1,2],[3,4,5],[6,7,8],
                  [0,3,6],[1,4,7],[2,5,8],
                  [0,4,8],[2,4,6],
                ].find(([a,b,c]) =>
                  board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[i]
                );
                return Boolean(winning && winning.includes(i));
              })();
              return (
                <button
                  key={i}
                  aria-label={`cell ${i+1} ${cell === "H" ? "Horse" : cell === "P" ? "Pawn": ""}`}
                  onClick={() => handleSquareClick(i)}
                  className="flex items-center justify-center bg-white rounded-lg min-h-0 aspect-square w-full h-full transition-colors
                    text-4xl sm:text-5xl border-none shadow-sm hover:bg-gray-100 focus:outline-none"
                  style={{
                    cursor: cell || winner ? "default" : "pointer",
                    border: isWinning ? `2px solid ${COLORS.accent}` : "2px solid rgba(0,0,0,0.03)",
                    background: isWinning ? "#fff6ec" : undefined,
                  }}
                  disabled={!!cell || !!winner}
                  tabIndex={0}
                >
                  {cell &&
                    <ChessIcon
                      kind={cell}
                      color={cell === "H" ? COLORS.primary : COLORS.secondary}
                      size={52}
                    />
                  }
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex w-full justify-between mt-8 gap-4">
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg px-4 py-2 font-semibold text-white transition-colors min-w-20 shadow-sm"
            style={{
              background: COLORS.accent,
              letterSpacing: 0.2
            }}
            aria-label="Reset game"
          >
            Reset
          </button>
        </div>
      </div>
      <footer className="mt-16 text-gray-400 text-xs text-center opacity-90">
        Built with Next.js. Horses © &nbsp;<span role="img" aria-label="horse">🐴</span>&nbsp; and Pawns &nbsp;<span role="img" aria-label="pawn">♟</span>
      </footer>
    </div>
  );
}
