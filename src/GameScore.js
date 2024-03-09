import "./App.css";
export function GameScore({ players }) {
  if (!players) return;
  const displayPlayers = players.sort((a, b) => b?.score - a?.score);
  return (
    <div className="game-players">
      {displayPlayers.map((p) => (
        <div
          key={p?.name}
          className={p?.active ? "game-player active" : "game-player"}
        >
          <label>{p?.name} </label>
          <label>{p?.score}</label>
        </div>
      ))}
    </div>
  );
}
