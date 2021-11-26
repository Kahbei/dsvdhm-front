import "./App.css";

import { Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DataManager from "./DataManager/DataManager";
import GameTitle from "./GameTitle/GameTitle";
import ElementsDetails from "./ElementsDetails/ElementsDetails";
import DeleteData from "./DeleteData/DeleteData";
import CreateData from "./CreateData/CreateData";
import ModificationData from "./ModificationData/ModificationData";

function App() {
    /* --- State of entities list --- */
    const [heroes, setHeroes] = useState([]);
    const [monsters, setMonsters] = useState([]);
    // const [equipements, setEquipements] = useState([]);

    const [loading, setLoading] = useState(false);

    /**
     * Get the entities list
     * @param {string} entity Type of entity
     */
    const getAllEntities = async (entity) => {
        setLoading(true);
        await fetch(`${process.env.REACT_APP_API_BASEURL}/entities/${entity}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then(
                (jsonData) =>
                    entity === "heroes"
                        ? setHeroes(jsonData)
                        : entity === "monsters"
                        ? setMonsters(jsonData)
                        : ""
                // : entity === "equipements"
                // ? setEquipements(jsonData)
                // : ""
            )
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getAllEntities("heroes");
        getAllEntities("monsters");
        // getAllEntitiess("equipements");
    }, []);

    if (loading) {
        return (
            <>
                <p>Please wait a moment...</p>
            </>
        );
    }

    return (
        <>
            <Link to="/">Accueil</Link>
            <Link to="/characters-builder">Ruler designer</Link>

            <Routes>
                <Route path="/" element={<GameTitle />} />
                <Route
                    path="/characters-builder"
                    element={
                        <DataManager
                            getHeroes={heroes}
                            getMonsters={monsters}
                            // getEquipements={equipements}
                        />
                    }
                />
                <Route path="/characters-builder/:element/create" element={<CreateData />} />
                <Route path="/characters-builder/:element/:id" element={<ElementsDetails />} />
                <Route
                    path="/characters-builder/:element/:id/update"
                    element={<ModificationData />}
                />
                <Route
                    path="/characters-builder/:element/:id/delete"
                    element={<DeleteData setHeroes={setHeroes} />}
                />
            </Routes>
        </>
    );
}

export default App;
