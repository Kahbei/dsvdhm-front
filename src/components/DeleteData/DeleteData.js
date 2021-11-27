import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function DeleteData() {
    const { id, element } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * Deletion of the selected entity
     * @param {string} entityID
     * @param {string} entity
     */
    const deleteEntity = async (entityID, entity) => {
        setLoading(true);
        await fetch(`${process.env.REACT_APP_API_BASEURL}/entities/${entity}/${entityID}`, {
            method: "DELETE",
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        deleteEntity(id, element);
    }, [id, element]);

    if (loading) {
        return (
            <>
                <p>Please wait a moment...</p>
            </>
        );
    }

    navigate("/characters-builder");

    return <></>;
}

export default DeleteData;
