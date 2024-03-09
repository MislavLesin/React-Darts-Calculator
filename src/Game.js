import { useEffect, useReducer } from "react";
import { DisplayWinner } from "./DisplayWinner";
import { GameForm } from "./GameForm";
import { GameScore } from "./GameScore";
import "./App.css";

export function Game({ noPlayers, game }) {
  const allPlayers = [
    { id: 1, name: "Player 1", score: game, active: true },
    { id: 2, name: "Player 2", score: game, active: false },
    { id: 3, name: "Player 3", score: game, active: false },
    { id: 4, name: "Player 4", score: game, active: false },
  ];
  const initialState = {
    hasWinner: false,
    round: 1,
    players: allPlayers.slice(0, noPlayers),
    winnerIndex: 0,
  };

  const [{ players, hasWinner, round, winnerIndex }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(
    function () {
      if (round > 20) {
        alert("Game Finished!");
        let winnerIndex = 0;
        let bestScore = 999;
        for (let i = 0; i < noPlayers; i++) {
          if (players[i].score < bestScore) {
            bestScore = players[i].score;
            winnerIndex = i;
          }
        }
        dispatch({ type: "winner", payload: winnerIndex });
      }
    },
    [noPlayers, players, round]
  );

  function handleWinner() {
    let winnerIndex = 0;
    let bestScore = 999;
    for (let i = 0; i < noPlayers; i++) {
      if (players[i].score < bestScore) {
        bestScore = players[i].score;
        winnerIndex = i;
      }
    }
    dispatch({ type: "winner", payload: winnerIndex });
  }

  function getActivePlayerIndex() {
    for (let i = 0; i < noPlayers; i++) {
      if (players[i].active) return i;
    }
  }

  function getActivePlayerId() {
    let id = null;
    players.forEach((player) => {
      if (player.active) id = player.id;
    });
    return id;
  }

  function nextPlayer() {
    dispatch({
      type: "nextPlayer",
      payload: {
        activePlayerId: getActivePlayerId(),
        noPlayers: noPlayers,
      },
    });
    /*   let playersAfterUpdate = players.map((player) => {
      if (player.active === true) {
        if (player.id === noPlayers) dispatch({ type: "nextRound" });
        return { ...player, active: false };
      } else return player;
    });
    playersAfterUpdate = playersAfterUpdate.map((p, i) =>
      i === (getActivePlayerIndex() + 1) % noPlayers
        ? { ...p, active: true }
        : p
    );
    dispatch({ type: "updatePlayers", payload: playersAfterUpdate }); */
  }

  function setPlayerScore(id, shot) {
    dispatch({ type: "updatePlayerScore", payload: { id: id, shot: shot } });
  }

  return (
    <div className="game-container">
      {" "}
      <GameScore players={players} />
      {!hasWinner ? (
        <GameForm
          activePlayer={players[getActivePlayerIndex()]}
          onSetNext={nextPlayer}
          onSetPlayerScore={setPlayerScore}
          onGameWon={handleWinner}
          round={round}
        />
      ) : (
        <DisplayWinner player={players[winnerIndex]} />
      )}
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "winner":
      return {
        ...state,
        hasWinner: true,
        winnerIndex: action.payload,
      };
    /*    case "updatePlayers":
      return {
        ...state,
        players: action.payload,
      }; */
    case "nextPlayer":
      let playersAfterUpdate = state.players.map((player) => {
        if (player.active) return { ...player, active: false };
        else if (
          player.id ===
          (action.payload.activePlayerId % action.payload.noPlayers) + 1
        )
          return { ...player, active: true };
        else return player;
      });

      if (action.payload.activePlayerId === action.payload.noPlayers)
        return {
          ...state,
          players: playersAfterUpdate,
          round: state.round + 1,
        };

      return { ...state, players: playersAfterUpdate };
    case "updatePlayerScore":
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.payload.id
            ? { ...p, score: p.score - action.payload.shot }
            : p
        ),
      };
    default:
      throw new Error("Unexpected type");
  }
}
