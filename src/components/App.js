import "./App.css";

import { Route, Routes } from "react-router";
import { Link } from "react-router-dom";

import DataManager from "./DataManager/DataManager";
import GameTitle from "./GameTitle/GameTitle";
import ElementsDetails from "./ElementsDetails/ElementsDetails";
import DeleteData from "./DeleteData/DeleteData";
import CreateData from "./CreateData/CreateData";
import ModificationData from "./ModificationData/ModificationData";

function App() {
    return (
        <>
            <Link to="/">Accueil</Link>
            <Link to="/characters-builder">Ruler designer</Link>

            <Routes>
                <Route path="/" element={<GameTitle />} />
                <Route path="/characters-builder" element={<DataManager />} />
                <Route path="/characters-builder/:element/create" element={<CreateData />} />
                <Route path="/characters-builder/:element/:id" element={<ElementsDetails />} />
                <Route
                    path="/characters-builder/:element/:id/update"
                    element={<ModificationData />}
                />
                <Route path="/characters-builder/:element/:id/delete" element={<DeleteData />} />
            </Routes>
        </>
    );
}

export default App;
