import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [noPlayers, setNoPlayers] = useState(null);
  const [game, setGame] = useState(null);
  const gameReady = noPlayers !== null && game !== null ? true : false;

  function handleSelectGame(num) {
    setGame(num !== game ? num : null);
  }

  function handleSelectPlayers(num) {
    setNoPlayers(num !== noPlayers ? num : null);
  }

  return (
    <div>
      <SelectPlayers onSelectPlayers={handleSelectPlayers} />
      {noPlayers ? (
        <MessageContainer>Selected {noPlayers} player game</MessageContainer>
      ) : null}
      {noPlayers ? <GameSelect onSetGame={handleSelectGame} /> : null}

      {game ? <MessageContainer>Selected {game} game</MessageContainer> : null}
      {gameReady && (
        <Game noPlayers={noPlayers} game={game} key={noPlayers + game} />
      )}
    </div>
  );
}

function SelectPlayers({ onSelectPlayers }) {
  function selectPlayers(num) {
    onSelectPlayers(num);
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

function MessageContainer({ children }) {
  return (
    <div className="selected-container">
      <h2>{children}</h2>
    </div>
  );
}

function GameSelect({ onSetGame }) {
  return (
    <div className="game-select-container">
      <div className="game-select two" onClick={() => onSetGame(201)}>
        201
      </div>
      <div className="game-select three" onClick={() => onSetGame(301)}>
        301
      </div>
      <div className="game-select four" onClick={() => onSetGame(501)}>
        501
      </div>
    </div>
  );
}

function Game({ noPlayers, game }) {
  const allPlayers = [
    { id: 1, name: "Player 1", score: game, active: true },
    { id: 2, name: "Player 2", score: game, active: false },
    { id: 3, name: "Player 3", score: game, active: false },
    { id: 4, name: "Player 4", score: game, active: false },
  ];

  const [players, setPlayers] = useState(allPlayers.slice(0, noPlayers));
  const [hasWinner, setHasWinner] = useState(false);

  function handleWinner() {
    setHasWinner(true);
  }
  function getActivePlayerIndex() {
    for (let i = 0; i < noPlayers; i++) {
      if (players[i].active) return i;
    }
  }

  function nextPlayer() {
    let playersAfterUpdate = players.map((player) =>
      player.active === true ? { ...player, active: false } : player
    );
    playersAfterUpdate = playersAfterUpdate.map((p, i) =>
      i === (getActivePlayerIndex() + 1) % noPlayers
        ? { ...p, active: true }
        : p
    );
    setPlayers([...playersAfterUpdate]);
  }

  function setPlayerScore(id, shot) {
    const playersAfterUpdate = players.map((p) =>
      p.id === id ? { ...p, score: p.score - shot } : p
    );
    setPlayers(playersAfterUpdate);
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
        />
      ) : (
        <DisplayWinner player={players[getActivePlayerIndex()]} />
      )}
    </div>
  );
}

function GameScore({ players }) {
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

function GameForm({ activePlayer, onSetNext, onSetPlayerScore, onGameWon }) {
  const [value, setValue] = useState(null);
  const [multiplyer, setMultiplyer] = useState(null);
  const total = value * multiplyer;
  const [remainingShots, setRemainingShots] = useState(3);
  const [round, setRound] = useState(0);

  function handleSetValue(num) {
    if (num === value) {
      setMultiplyer(null);
      return setValue(null);
    }
    if (multiplyer === null) setMultiplyer(1);
    setValue(num);
  }

  function handleSetMultiplyer(num) {
    setMultiplyer(num === multiplyer ? null : num);
  }

  function handleSubmit() {
    if (activePlayer.score < total) {
      alert("Busted!!");
      onSetNext();
      setRemainingShots(3);
      setValue(null);
      setMultiplyer(null);
      setRound((r) => r + 1);
    } else {
      onSetPlayerScore(activePlayer.id, total);
      setValue(null);
      setMultiplyer(null);
      setRound((r) => r + 1);
      setRemainingShots((s) => s - 1);
    }
  }

  useEffect(
    function () {
      if (remainingShots === 0) {
        onSetNext();
        setRemainingShots(3);
      }
    },
    [setRemainingShots, onSetNext, remainingShots]
  );

  useEffect(
    function () {
      if (activePlayer.score === 0) onGameWon();
    },
    [activePlayer, onGameWon]
  );

  function handleMissShot() {
    setValue(null);
    setMultiplyer(null);
    setRemainingShots((s) => s - 1);
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
      {value !== null && multiplyer !== null && remainingShots > 0 ? (
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

function DisplayWinner({ player }) {
  return (
    <div className="display-winner-container">
      <h2 className="display-winner">{player.name} has won the game!!</h2>
    </div>
  );
}
