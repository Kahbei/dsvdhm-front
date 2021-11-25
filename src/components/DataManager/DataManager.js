import "./DataManager.css";
import { Link } from "react-router-dom";

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
                </div>
            ))}
        </div>
    );
};

function DataManager(props) {
    return (
        <>
            <ElementList getElement={props.getHeroes} elementType="heroes" />
            <ElementList getElement={props.getMonsters} elementType="monsters" />
            {/* <ElementList getElement={props.getEquipements} elementType="equipements" /> */}
        </>
    );
}

export default DataManager;
