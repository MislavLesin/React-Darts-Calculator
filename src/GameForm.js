import { useEffect, useReducer } from "react";
import "./App.css";

export function GameForm({
  activePlayer,
  onSetNext,
  onSetPlayerScore,
  onGameWon,
  round,
}) {
  const initialState = {
    value: null,
    multiplyer: null,
    remainingShots: 3,
  };

  const [{ value, multiplyer, remainingShots }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const total = value === 25 || value === 50 ? value : value * multiplyer;

  function handleSetValue(num) {
    console.log(num);
    if (num > 20) {
      dispatch({ type: "setBullseye", payload: num });
    } else dispatch({ type: "setValue", payload: num });
  }

  function handleSetMultiplyer(num) {
    dispatch({ type: "setMultiplier", payload: num });
  }

  function handleSubmit() {
    if (activePlayer.score < total) {
      alert("Busted!");
      onSetNext();
      dispatch({
        type: "busted",
      });
    } else {
      onSetPlayerScore(activePlayer.id, total);

      dispatch({
        type: "submit",
        payload: {
          total: total,
          activePlayer: activePlayer,
        },
      });
    }
  }

  useEffect(
    function () {
      if (remainingShots === 0) {
        onSetNext();
        dispatch({ type: "nextPlayer" });
      }
    },
    [dispatch, remainingShots, onSetNext]
  );

  useEffect(
    function () {
      if (activePlayer?.score === 0) onGameWon();
    },
    [activePlayer, onGameWon]
  );

  function handleMissShot() {
    dispatch({ type: "missShot" });
  }

  return (
    <div className="game-form">
      <div className="game-form-values">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <button
            className={
              value === num ? "game-form-button active" : "game-form-button"
            }
            value={num}
            key={num}
            onClick={() => handleSetValue(num)}
          >
            {num}
          </button>
        ))}
      </div>
      <div>
        <button
          className={
            value === 25
              ? "game-form-button-bullseye active"
              : "game-form-button-bullseye"
          }
          value={25}
          key={25}
          onClick={() => handleSetValue(25)}
        >
          Bullseye
        </button>{" "}
        <button
          className={
            value === 50
              ? "game-form-button-double-bullseye active"
              : "game-form-button-double-bullseye"
          }
          value={50}
          key={50}
          onClick={() => handleSetValue(50)}
        >
          Double Bullseye
        </button>
      </div>
      <div className="game-form-multiplyers">
        {Array.from({ length: 3 }, (_, i) => i + 1).map((num) => (
          <button
            className={
              multiplyer === num
                ? "game-form-button active"
                : "game-form-button"
            }
            value={num}
            key={num}
            onClick={() => handleSetMultiplyer(num)}
            disabled={value === 25 || value === 50 ? true : false}
          >
            {num}
          </button>
        ))}
      </div>
      <div>
        <button
          className={
            multiplyer === 0
              ? "game-form-button-miss active"
              : "game-form-button-miss"
          }
          value={0}
          onClick={() => handleMissShot()}
        >
          Miss
        </button>
      </div>
      <div className="remining-darts-container">
        <label className="remaining-shots-label">Remaining Shots</label>
        <div className="remining-darts">
          <div className="dart">
            {remainingShots === 1 && "🎯"}
            {remainingShots === 2 && "🎯🎯"}
            {remainingShots === 3 && "🎯🎯🎯"}
          </div>
        </div>
        <div className="round">
          <p>Round:</p>
          <p>{round} / 20</p>
        </div>
      </div>
      {(value !== null && multiplyer !== null && remainingShots > 0) ||
      value > 20 ? (
        <button
          className="game-form-button-submit"
          onClick={() => handleSubmit()}
        >
          Confirm {total}
        </button>
      ) : null}
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "setValue":
      if (state.value === action.payload)
        return { ...state, value: null, multiplyer: null };
      if (state.multiplyer === null)
        return { ...state, multiplyer: 1, value: action.payload };
      return { ...state, value: action.payload };
    case "setBullseye": {
      if (state.value === action.payload)
        return { ...state, value: null, multiplyer: null };
      return { ...state, value: action.payload, multiplyer: null };
    }
    case "setMultiplier":
      return {
        ...state,
        multiplyer: action.payload === state.multiplyer ? null : action.payload,
      };
    case "missShot":
      return {
        ...state,
        value: null,
        multiplyer: null,
        remainingShots: state.remainingShots - 1,
      };
    case "nextPlayer":
      return { ...state, remainingShots: 3 };
    case "busted":
      return { ...state, value: null, multiplyer: null, remainingShots: 3 };
    case "submit":
      return {
        ...state,
        value: null,
        multiplyer: null,
        remainingShots: state.remainingShots - 1,
      };
    default:
      throw new Error("Unexpected aciton type");
  }
}
