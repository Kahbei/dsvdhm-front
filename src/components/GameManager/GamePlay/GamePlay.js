import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./GamePlay.css";

function GamePlay(props) {
    const navigate = useNavigate();
    const location = useLocation();

    /* ------------------------ State ------------------------  */
    const [hero, setHero] = useState({});
    const [monsters, setMonsters] = useState([]);
    const [usedPA, setUsedPA] = useState(2);
    const [toDisabled, setToDisabled] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    /* -------------------------------------------------------- */

    /* -- Redirect if the user go directly to "/play" and not from "/start" -- */
    useEffect(() => {
        if (location.state === null) {
            navigate("/start");
        } else {
            setHero(location.state.heroChosen);
            setMonsters(location.state.packMonster);
        }
    }, [location.state, navigate]);

    /**
     * Return a randomized number
     * @param {Number} num
     * @param {Number} zero If it's set, the rnd number will be between zero value and number value
     * @returns {Number}
     */
    const getRndNum = (num, zero) => {
        console.log(zero ? true : false);
        return zero ? Math.floor(Math.random() * num) + zero : Math.floor(Math.random() * num);
    };

    /**
     *
     * @param {Number} def Defense of the ennemy
     * @param {Number} basePA Basic value of the special attak capacity
     * @param {Number} usedPA PA number used, minimum 2 if used
     * @param {Number} baseATK Basic ATK value of the attack capacity
     * @param {Number} statATK ATK value in the stat
     * @param {Number} protection Value of the protection
     * @param {Number} crit Value which define the thresold for a critical attack
     * @returns
     */
    const degatEquation = (def, basePA, usedPA, baseATK, statATK, protection, crit) => {
        const damageFormula = Math.abs(
            def - (2 * Math.sqrt(basePA * usedPA + 1 * (baseATK * statATK))) / (1 + protection)
        );

        const critical = Math.floor(Math.random() * 100) > 100 - crit ? true : false;
        const damage = critical ? damageFormula * 2 : damageFormula;

        return Math.floor(damage);
    };

    /**
     * Return the counter attack if the entity choose the guard
     * @param {Number} damageWaited
     * @returns
     */
    const riposte = (damageWaited) => {
        return damageWaited / 2;
    };

    // const setDamage = (attaquant, defenseur, attaquantAction, defenseurProtection) => {
    //     let paNb = 0;

    //     if (attaquantAction === "atqSpe") {
    //         paNb = 2;
    //     }

    //     const damage = degatEquation(
    //         defenseur.stats.defense,
    //         attaquant.stats.attaqueSpecial,
    //         paNb,
    //         attaquant.capacite.attaque,
    //         attaquant.stats.attaque,
    //         defenseurProtection,
    //         attaquant.stats.chance
    //     );

    //     return damage;
    // };

    /**
     * Define the action of the monster randomly
     * @param {Object} monster
     * @returns
     */
    const setMobAction = (monster) => {
        let action = "";
        let protectionValue = 0;

        if (monster.stats.pa > 0) {
            switch (getRndNum(3, 0)) {
                case 1:
                    action = "atq";
                    protectionValue = 0;
                    break;
                case 2:
                    action = "atqSpe";
                    protectionValue = 0;
                    break;
                default:
                    action = "garde";
                    protectionValue = monster.capacite.protection;
                    break;
            }
        } else {
            switch (getRndNum(2, 0)) {
                case 1:
                    action = "atq";
                    protectionValue = 0;
                    break;
                default:
                    action = "garde";
                    protectionValue = monster.capacite.protection;
                    break;
            }
        }

        return { action: action, protectionValue: protectionValue };
    };

    /**
     * Set the protection value following the action of the player
     * @param {string} selectedAction
     * @returns
     */
    const setHeroAction = (selectedAction) => {
        let action = "";
        let protectionValue = 0;

        switch (selectedAction) {
            case "atq":
                action = "atq";
                protectionValue = 0;
                break;
            case "atqSpe":
                action = "atqSpe";
                protectionValue = 0;
                break;
            default:
                action = "garde";
                protectionValue = hero.capacite.protection;
                break;
        }

        return { action: action, protectionValue: protectionValue };
    };

    /**
     * Set the logic of a play round
     * @param {string} choix
     * @param {int} paUsed
     */
    const onClickAction = (choix, paUsed = 0) => {
        const monsterChoice = setMobAction(monsters[0]);
        const heroChoice = setHeroAction(choix);
        let degatHero = 0;
        let degatMonstre = 0;

        /* --------------------------------------------------------------------- */
        /* ------------ Set the player damage following his action  ------------ */
        /* --------------------------------------------------------------------- */
        if (heroChoice.action === "atq") {
            degatHero = degatEquation(
                monsters[0].stats.defense,
                hero.capacite.attaqueSpecial,
                0,
                hero.capacite.attaque,
                hero.stats.attaque,
                monsterChoice.protectionValue,
                hero.stats.chance
            );
        } else if (heroChoice.action === "atqSpe") {
            degatHero = degatEquation(
                monsters[0].stats.defense,
                hero.capacite.attaqueSpecial,
                paUsed,
                hero.capacite.attaque,
                hero.stats.attaque,
                monsterChoice.protectionValue,
                hero.stats.chance
            );

            hero.stats.pa -= paUsed;
            setUsedPA(2);

            if (hero.stats.pa <= 0) {
                setToDisabled(true);
            }
        } else {
            degatHero = 0;
        }

        /* ---------------------------------------------------------------------- */
        /* ------------ Set the monster damage following its action  ------------ */
        /* ---------------------------------------------------------------------- */
        if (monsterChoice.action === "atq") {
            degatMonstre = degatEquation(
                hero.stats.defense,
                monsters[0].capacite.attaqueSpecial,
                0,
                monsters[0].capacite.attaque,
                monsters[0].stats.attaque,
                heroChoice.protectionValue,
                monsters[0].stats.chance
            );
        } else if (monsterChoice.action === "atqSpe") {
            degatMonstre = degatEquation(
                hero.stats.defense,
                monsters[0].capacite.attaqueSpecial,
                2,
                monsters[0].capacite.attaque,
                monsters[0].stats.attaque,
                heroChoice.protectionValue,
                monsters[0].stats.chance
            );

            monsters[0].stats.pa -= 2;
        } else {
            degatMonstre = 0;
        }

        /* ---------------------------------------------------------- */
        /* ------------ Set the damage on each entity HP ------------*/
        /* ---------------------------------------------------------- */
        hero.stats.pv -= degatMonstre;
        monsters[0].stats.pv -= degatHero;

        if (monsterChoice.action === "garde") {
            hero.stats.pv -= riposte(degatHero);
        } else if (heroChoice.action === "garde") {
            monsters[0].stats.pv -= riposte(degatMonstre);
        }

        console.log(monsters);
        console.log("Mob nom : " + monsters[0].name);
        console.log("Mob choix : " + monsterChoice.action);
        console.log("Hero PV : " + hero.stats.pv);
        console.log("Monstre PV : " + monsters[0].stats.pv);
        console.log("Monstre PA : " + monsters[0].stats.pa);

        /* ---------------------------------------------------------------------- */
        /* -- Check entity HP to either eliminate the monster or end the game -- */
        /* ---------------------------------------------------------------------- */
        if (hero.stats.pv <= 0) {
            setGameEnded(true);
        }
        if (monsters[0].stats.pv <= 0) {
            setMonsters(monsters.slice(1));

            if (monsters.length === 0) {
                setGameEnded(true);
            }
        }
    };

    /**
     * To get dynamically the used PA number from the input
     * @param {*} evt
     */
    const handleUsedPAChange = (evt) => {
        setUsedPA(evt.target.value);
    };

    if (!gameEnded && monsters.length > 0) {
        return (
            <>
                <button onClick={() => onClickAction("atq")}>Attaque</button>
                <button onClick={() => onClickAction("atqSpe", usedPA)} disabled={toDisabled}>
                    Attaque Spécial
                </button>
                <label for="paUsed">{usedPA}</label>
                <input
                    name="paUsed"
                    type="range"
                    min="2"
                    max={hero.stats.pa}
                    step="2"
                    value={usedPA}
                    onChange={handleUsedPAChange}
                    disabled={toDisabled}
                />
                <button onClick={() => onClickAction("garde")}>Bouclier</button>
            </>
        );
    } else {
        return (
            <>
                <p>Merde !</p>
            </>
        );
    }
}

export default GamePlay;
