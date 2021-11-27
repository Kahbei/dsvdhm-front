import "./DataManager.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ElementList = (props) => {
    return (
        <div className={`List-${props.elementType}`}>
            {props.getElement.map((e) => (
                <div
                    style={{
                        border: "2px solid #000",
                        width: "fit-content",
                        margin: "1em 0.5em",
                        padding: "0.5em",
                    }}
                >
                    <img
                        src={e.image}
                        alt={e.name}
                        style={{ border: "1px solid #000", maxWidth: "50%" }}
                    />
                    <p>{e.name}</p>
                    <p>PV : {e.stats.pv}</p>
                    <p>PA : {e.stats.pa}</p>
                    <p>Attaque : {e.stats.attaque}</p>
                    <p>Défense : {e.stats.defense}</p>
                    <p>Chance : {e.stats.chance}</p>
                    <Link to={`/characters-builder/${props.elementType}/${e._id}`}>Details</Link>
                    <Link to={`/characters-builder/${props.elementType}/${e._id}/update`}>
                        Modifier
                    </Link>
                    <Link to={`/characters-builder/${props.elementType}/${e._id}/delete`}>
                        Supression
                    </Link>
                </div>
            ))}
            <Link to={`/characters-builder/${props.elementType}/create`}>Create</Link>
        </div>
    );
};

function DataManager(props) {
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
            <ElementList getElement={heroes} elementType="heroes" />
            <ElementList getElement={monsters} elementType="monsters" />
            {/* <ElementList getElement={props.getEquipements} elementType="equipements" /> */}
        </>
    );
}

export default DataManager;
