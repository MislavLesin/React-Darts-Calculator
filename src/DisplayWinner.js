import "./App.css";
export function DisplayWinner({ player }) {
  return (
    <div className="display-winner-container">
      <h2 className="display-winner">{player.name} has won the game!!</h2>
    </div>
  );
}
