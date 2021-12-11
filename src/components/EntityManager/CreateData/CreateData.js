import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import CUForm from "../CUForm/CUForm";
import "./CreateData.css";

function CreateData() {
    const { element } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * Create a new entity
     * @param {string} entity Type of the entity
     * @param {object} body
     */
    const createEntity = async (entity, body) => {
        setLoading(true);
        await fetch(`${process.env.REACT_APP_API_BASEURL}/entities/${entity}/new`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        }).finally(() => setLoading(false));
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const createForm = {
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
        createEntity(element, createForm);

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
                <CUForm />
                <button type="submit">Créer</button>
            </form>
        </>
    );
}

export default CreateData;
