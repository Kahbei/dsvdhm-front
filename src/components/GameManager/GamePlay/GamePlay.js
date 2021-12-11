import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import HeroCard from "../HeroCard/HeroCard";
import "./GamePlay.css";

function GamePlay(props) {
    const navigate = useNavigate();
    const location = useLocation();

    /* ------------------------ State ------------------------  */
    const [hero, setHero] = useState({});
    const [monsters, setMonsters] = useState([]);
    const [difficulty, setDifficulty] = useState("");
    const [usedPA, setUsedPA] = useState(2);
    const [toDisabled, setToDisabled] = useState(false);
    const [infoGame, setInfoGame] = useState([]);
    const [gameTurn, setGameTurn] = useState(1);
    const [battleNB, setBattleNB] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);
    const [loading, setLoading] = useState(true);
    /* -------------------------------------------------------- */

    /* -- Redirect if the user go directly to "/play" and not from "/start" -- */
    useEffect(() => {
        if (location.state === null) {
            navigate("/start");
        } else {
            setHero(location.state.heroChosen);
            setMonsters(location.state.packMonster);
            setDifficulty(location.state.difficultyChosen);
            setLoading(false);
        }
    }, [location.state, navigate]);

    /**
     * Return a randomized number
     * @param {Number} num
     * @param {Number} zero If it's set, the rnd number will be between zero value and number value
     * @returns {Number}
     */
    const getRndNum = (num, zero) => {
        return zero ? Math.floor(Math.random() * num) + zero : Math.floor(Math.random() * num);
    };

    /**
     * Use the damage formule
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
     * Define the upgrade that the hero gain after the end of a fight depending of the difficulty mode
     * @param {Number} degatTaken
     * @param {Number} paTaken
     * @param {Number} battleNumber
     */
    const statsUpgradeAtEnd = (degatTaken, paTaken, battleNumber) => {
        let heroStatsUp = hero.stats;

        if (difficulty === "normal") {
            if (degatTaken) {
                heroStatsUp.pv += degatTaken / 2;
            }

            heroStatsUp.pa += 2;

            if (battleNumber === 2 || battleNumber === 4) {
                for (const key in heroStatsUp) {
                    if (
                        Object.hasOwnProperty.call(heroStatsUp, key) &&
                        key !== "pa" &&
                        key !== "pv"
                    ) {
                        heroStatsUp[key] += 10;
                    }
                }
            }
        } else {
            if (degatTaken) {
                heroStatsUp.pv += degatTaken / 3;
            }

            heroStatsUp.pa += 4;

            for (const key in heroStatsUp) {
                if (Object.hasOwnProperty.call(heroStatsUp, key) && key !== "pa" && key !== "pv") {
                    heroStatsUp[key] += 5;
                }
            }
        }
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
        let heroLostPV = 0;
        let heroLostPA = 0;

        setGameTurn(gameTurn + 1);
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
            heroLostPA += paUsed;
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
            degatMonstre = riposte(degatHero);
            hero.stats.pv -= degatMonstre;
        } else if (heroChoice.action === "garde") {
            monsters[0].stats.pv -= riposte(degatMonstre);
        }

        heroLostPV += degatHero;

        if (hero.stats.pa <= 0) {
            setUsedPA(0);
            setToDisabled(true);
        } else {
            setUsedPA(2);
            setToDisabled(false);
        }

        setInfoGame("");
        let infoGameTurn = [];
        infoGameTurn[0] = `Tour n°${gameTurn} :`;
        infoGameTurn[1] = `${monsters[0].name} va faire ${monsterChoice.action} ! `;
        infoGameTurn[2] = `${hero.name} a perdu ${degatMonstre} points de vie ! `;
        infoGameTurn[3] = `${hero.name} va faire ${heroChoice.action} ! `;
        infoGameTurn[4] = `${monsters[0].name} a perdu ${degatHero} points de vie ! `;

        /* ---------------------------------------------------------------------- */
        /* -- Check entity HP to either eliminate the monster or end the game -- */
        /* ---------------------------------------------------------------------- */
        if (hero.stats.pv <= 0) {
            infoGameTurn[6] = `Oh non ! Le héro ${hero.name} a perdu, l'espoir vient de partir !`;

            setInfoGame(infoGameTurn);
            setGameEnded(true);
        } else {
            if (monsters[0].stats.pv <= 0) {
                infoGameTurn[5] = `${monsters[0].name} a été vaincu par ${hero.name} ! `;

                setBattleNB(battleNB + 1);
                statsUpgradeAtEnd(heroLostPV, heroLostPA, battleNB);
                setMonsters(monsters.slice(1));

                if (monsters.length <= 1 && monsters[0].stats.pv <= 0) {
                    infoGameTurn[6] = `Bravo héros ${hero.name} ! Vous avez terrassé tout les monstres !`;
                    setGameEnded(true);
                }
            } else {
                infoGameTurn[5] = `Il reste à ${monsters[0].name} ${monsters[0].stats.pv} points de vie ! Tandis que pour le héro ${hero.name} il lui reste ${hero.stats.pv} points de vie ! `;
                setInfoGame(infoGameTurn);
            }

            setInfoGame(infoGameTurn);
        }
    };

    /**
     * To get dynamically the used PA number from the input
     * @param {*} evt
     */
    const handleUsedPAChange = (evt) => {
        setUsedPA(evt.target.value);
    };

    if (loading) {
        return (
            <>
                <p>Please wait a moment...</p>
            </>
        );
    }

    if (!gameEnded) {
        return (
            <>
                <button onClick={() => onClickAction("atq")}>Attaque</button>
                <button onClick={() => onClickAction("atqSpe", usedPA)} disabled={toDisabled}>
                    Attaque Spécial
                </button>
                <label htmlFor="paUsed">{usedPA}</label>
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

                {infoGame.map((e) => (
                    <p>{e}</p>
                ))}

                <HeroCard hero={hero} />
                <p>VS</p>
                <HeroCard hero={monsters[0]} />
            </>
        );
    } else {
        return (
            <>
                <p>{infoGame[6]}</p>
            </>
        );
    }
}

export default GamePlay;
