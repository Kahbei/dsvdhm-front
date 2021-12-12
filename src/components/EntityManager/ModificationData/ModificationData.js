import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import CUForm from "../CUForm/CUForm";
import "./ModificationData.css";

function ModificationData(props) {
    const { id, element } = useParams();
    const [entityUpdated, setEntityUpdated] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * Selection for one entity
     * @param {string} entityID
     * @param {string} entity Type of the entity
     */
    const getOneEntity = async (entityID, entity) => {
        setLoading(true);
        await fetch(`${process.env.REACT_APP_API_BASEURL}/entities/${entity}/${entityID}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((jsonData) => setEntityUpdated(jsonData))
            .finally(() => setLoading(false));
    };

    /**
     * Update the selected entity
     * @param {string} entityID
     * @param {string} entity ype of the entity
     * @param {object} body
     */
    const updateEntity = async (entityID, entity, body) => {
        setLoading(true);
        await fetch(`${process.env.REACT_APP_API_BASEURL}/entities/${entity}/${entityID}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getOneEntity(id, element);
    }, [id, element]);

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const uptadedForm = {
            name: evt.target.entityName.value,
            image: evt.target.entityImg.value,
            stats: {
                pv: parseInt(evt.target.statsPV.value),
                pa: parseInt(evt.target.statsPA.value),
                attaque: parseInt(evt.target.statsAttaque.value),
                defense: parseInt(evt.target.statsDefense.value),
                chance: parseInt(evt.target.statsChance.value),
            },
            capacite: {
                attaque: parseInt(evt.target.capaciteAttaque.value),
                attaqueSpecial: parseInt(evt.target.capaciteAttaqueSpecial.value),
                protection: parseInt(evt.target.capaciteProtection.value),
            },
        };
        setEntityUpdated(uptadedForm);
        updateEntity(id, element, uptadedForm);

        setTimeout(() => {
            navigate("/characters-builder");
        }, 500);
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
            <form onSubmit={handleSubmit}>
                <CUForm entity={entityUpdated} />
                <button type="submit">Modifier</button>
            </form>
        </>
    );
}

export default ModificationData;
