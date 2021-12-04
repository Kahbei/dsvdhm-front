import { useState } from "react";
import { useLocation } from "react-router";
import "./GamePlay.css";

function GamePlay(props) {
    const location = useLocation();
    const { heroChosen, packMonster, difficultyChosen } = location.state;
    const [hero, setHero] = useState(heroChosen);
    const [monsters, setMonsters] = useState(packMonster);
    const [gameEnded, setGameEnded] = useState(false);

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

    const onClickAction = (evt) => {
        const monsterChoice = setMobAction(monsters[0]);
        const heroChoice = setHeroAction(evt);
        let degatHero = 0;
        let degatMonstre = 0;

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
                2,
                hero.capacite.attaque,
                hero.stats.attaque,
                monsterChoice.protectionValue,
                hero.stats.chance
            );
        } else {
            degatHero = 0;
        }

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

    if (!gameEnded && monsters.length > 0) {
        return (
            <>
                <button onClick={() => onClickAction("atq")}>Attaque</button>
                <button onClick={() => onClickAction("atqSpe")}>Attaque Spécial</button>
                <button onClick={() => onClickAction("garde")}>Bouclier</button>
            </>
        );
    } else {
        return (
            <>
                <p>Test</p>
            </>
        );
    }
}

export default GamePlay;
