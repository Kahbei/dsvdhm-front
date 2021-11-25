import "./App.css";
import { Route, Routes } from "react-router";
import DataManager from "./DataManager/DataManager";
import GameTitle from "./GameTitle/GameTitle";
import { useEffect, useState } from "react";
import ElementsDetails from "./ElementsDetails/ElementsDetails";
import { Link } from "react-router-dom";

function App() {
    const [heroes, setHeroes] = useState([]);
    const [monsters, setMonsters] = useState([]);
    // const [equipements, setEquipements] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchGetAllElements = async (element) => {
        setLoading(true);
        await fetch(`${process.env.REACT_APP_API_BASEURL}/entities/${element}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then(
                (jsonData) =>
                    element === "heroes"
                        ? setHeroes(jsonData)
                        : element === "monsters"
                        ? setMonsters(jsonData)
                        : ""
                // : element === "equipements"
                // ? setEquipements(jsonData)
                // : ""
            )
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchGetAllElements("heroes");
        fetchGetAllElements("monsters");
        // fetchGetAllElements("equipements");
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
                <Route path="/characters-builder/:element/:id" element={<ElementsDetails />} />
            </Routes>
        </>
    );
}

export default App;
