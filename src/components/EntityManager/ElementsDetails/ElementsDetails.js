import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

function ElementsDetails() {
    const { id, element } = useParams();

    const [hero, setHero] = useState([]);
    const [monster, setMonster] = useState([]);
    // const [equipement, setEquipement] = useState([]);
    const [loading, setLoading] = useState(false);

    /**
     * Selection for one entity
     * @param {string} entityID
     * @param {string} entity Type of entity
     */
    const getOneEntity = async (entityID, entity) => {
        setLoading(true);
        await fetch(`${process.env.REACT_APP_API_BASEURL}/entities/${entity}/${entityID}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then(
                (jsonData) =>
                    entity === "heroes"
                        ? setHero(jsonData)
                        : entity === "monsters"
                        ? setMonster(jsonData)
                        : ""
                // : entity === "equipements"
                // ? setEquipement(jsonData)
                // : ""
            )
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getOneEntity(id, element);
    }, [id, element]);

    const DisplayData = (props) => {
        let hme;

        switch (props.element) {
            case "heroes":
                hme = hero;
                break;
            case "monsters":
                hme = monster;
                break;
            // case "equipements":
            //     hme = equipement;
            //     break;
            default:
                hme = {};
                break;
        }

        if (hme.stats === undefined || hme.capacite === undefined) {
            return (
                <>
                    <li>{hme.image}</li>
                    <li>Nom : {hme.name}</li>
                    <li>Stats: Ne charge pas</li>
                    <li>Capacite: Ne charge pas</li>
                </>
            );
        }

        return (
            <>
                <li>{hme.image}</li>
                <li>Nom : {hme.name}</li>
                <li>
                    Stats:
                    <ul>
                        <li>PV : {hme.stats.pv}</li>
                        <li>PA : {hme.stats.pa}</li>
                        <li>Attaque : {hme.stats.attaque}</li>
                        <li>Défense : {hme.stats.defense}</li>
                        <li>Chance : {hme.stats.chance}</li>
                    </ul>
                </li>
                <li>
                    Capacite:
                    <ul>
                        <li>Attaque : {hme.capacite.attaque}</li>
                        <li>Attaque Spécial : {hme.capacite.attaqueSpecial}</li>
                        <li>Protection : {hme.capacite.protection}</li>
                    </ul>
                </li>
            </>
        );
    };

    if (loading) {
        return (
            <>
                <p>Please wait a moment...</p>
            </>
        );
    }

    return (
        <>
            <ul>
                <DisplayData element={element} />
            </ul>
            <Link to={`/characters-builder/${element}/${id}/update`}>Modifier</Link>
            <Link to={`/characters-builder/${element}/${id}/delete`}>Supression</Link>
        </>
    );
}

export default ElementsDetails;
