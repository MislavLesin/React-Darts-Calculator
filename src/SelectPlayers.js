import "./App.css";
export function SelectPlayers({ dispatch }) {
  function selectPlayers(num) {
    dispatch({ type: "setNumPlayers", payload: num });
  }
  return (
    <div className="players-select-container">
      <div className="player-select two" onClick={() => selectPlayers(2)}>
        2 Players
      </div>
      <div className="player-select three" onClick={() => selectPlayers(3)}>
        3 Players
      </div>
      <div className="player-select four" onClick={() => selectPlayers(4)}>
        4 Players
      </div>
    </div>
  );
}
