import "./HeroCard.css";

function HeroCard(props) {
    return (
        <div>
            <img src={props.hero.image} alt={props.hero.name} />
            <p>Name: {props.hero.name}</p>
            <p>
                Point de vie : {props.hero.stats.pv} / {props.hero.stats.pv}
            </p>
            <p>Point de l'Ankou: {props.hero.stats.pa} </p>
            <p>Attaque: {props.hero.stats.attaque}</p>
            <p>Défense: {props.hero.stats.defense}</p>
            <p>Chance: {props.hero.stats.chance}</p>
            <p>Attaque normale: {props.hero.capacite.attaque}</p>
            <p>Attaque Spéciale: {props.hero.capacite.attaqueSpecial}</p>
            <p>Garde: {props.hero.capacite.protection}</p>
        </div>
    );
}

export default HeroCard;
