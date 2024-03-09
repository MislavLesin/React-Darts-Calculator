import { useReducer } from "react";
import "./App.css";
import { MessageContainer } from "./MessageContainer";
import { SelectPlayers } from "./SelectPlayers";
import { GameSelect } from "./GameSelect";
import { Game } from "./Game";

export default function App() {
  const [{ noPlayers, game }, dispatch] = useReducer(reducer, initialState);
  const gameReady = noPlayers !== null && game !== null ? true : false;

  return (
    <div>
      <SelectPlayers dispatch={dispatch} />
      {noPlayers ? (
        <MessageContainer>Selected {noPlayers} player game</MessageContainer>
      ) : null}
      {noPlayers ? <GameSelect dispatch={dispatch} /> : null}

      {game ? <MessageContainer>Selected {game} game</MessageContainer> : null}
      {gameReady && (
        <Game noPlayers={noPlayers} game={game} key={noPlayers + game} />
      )}
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "setGame":
      return {
        ...state,
        game: action.payload === state.game ? null : action.payload,
      };
    case "setNumPlayers":
      return {
        ...state,
        noPlayers: state.noPlayers === action.payload ? null : action.payload,
      };
    default:
      throw new Error("Unexpected type");
  }
}

const initialState = { noPlayers: null, game: null };
