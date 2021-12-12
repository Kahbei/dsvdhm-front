import "./App.css";

import { Route, Routes } from "react-router";
import { Link } from "react-router-dom";

import DataManager from "./EntityManager/DataManager/DataManager";
import GameSelection from "./GameManager/GameSelection/GameSelection";
import ElementsDetails from "./EntityManager/ElementsDetails/ElementsDetails";
import DeleteData from "./EntityManager/DeleteData/DeleteData";
import CreateData from "./EntityManager/CreateData/CreateData";
import ModificationData from "./EntityManager/ModificationData/ModificationData";
import GamePlay from "./GameManager/GamePlay/GamePlay";
import GameTitle from "./GameManager/GameTitle/GameTitle";

function App() {
  return (
    <>
      <span>
        |- <Link to="/">Accueil</Link> -|-
        <Link to="/start">Start the game</Link> -|-
        <Link to="/characters-builder">Ruler designer</Link> -|
      </span>

      <Routes>
        <Route path="/" element={<GameTitle />} />
        <Route path="/start" element={<GameSelection />} />
        <Route path="/play" element={<GamePlay />} />

        <Route path="/characters-builder" element={<DataManager />} />
        <Route
          path="/characters-builder/:element/create"
          element={<CreateData />}
        />
        <Route
          path="/characters-builder/:element/:id"
          element={<ElementsDetails />}
        />
        <Route
          path="/characters-builder/:element/:id/update"
          element={<ModificationData />}
        />
        <Route
          path="/characters-builder/:element/:id/delete"
          element={<DeleteData />}
        />
      </Routes>
    </>
  );
}

export default App;
