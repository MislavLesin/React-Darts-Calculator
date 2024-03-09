import "./App.css";
export function GameSelect({ dispatch }) {
  return (
    <div className="game-select-container">
      <div
        className="game-select two"
        onClick={() => dispatch({ type: "setGame", payload: 201 })}
      >
        201
      </div>
      <div
        className="game-select three"
        onClick={() => dispatch({ type: "setGame", payload: 301 })}
      >
        301
      </div>
      <div
        className="game-select four"
        onClick={() => dispatch({ type: "setGame", payload: 501 })}
      >
        501
      </div>
    </div>
  );
}
