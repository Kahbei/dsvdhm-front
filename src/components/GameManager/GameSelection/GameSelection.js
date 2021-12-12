import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroCard from "../HeroCard/HeroCard";
import "./GameSelection.css";

const DifficultyChoice = (props) => {
  const handleClick = (evt) => {
    if (evt.target.value === "normal") {
      props.setStateDifficulty("normal");
    } else {
      props.setStateDifficulty("hoffe");
    }
  };

  return (
    <>
      <div class="MenuDifficulte">
        <div class="boutton">
          <button
            type="button"
            onClick={handleClick}
            onMouseOver={() =>
              Resume(
                "TOTO",
                "https://i.pinimg.com/originals/1e/8d/32/1e8d32967db0f4fd5eaad1d6add34056.jpg"
              )
            }
            name="normal"
            value="normal"
          >
            Normal
          </button>
          <button
            type="button"
            onClick={handleClick}
            onMouseOver={() =>
              Resume(
                "TATA",
                "https://i.ytimg.com/vi/skV-q5KjrUA/maxresdefault.jpg"
              )
            }
            name="hoffeMann"
            value="hoffeMann"
          >
            Hoffe Mann
          </button>
        </div>
        <div class="DifficulteTexte">
          <img
            id="ImageDifficulte"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm223esmU7bRbMer2Nr8-Zg7GOpW7oF1HtSaYoJQmwdIQ-bBSw7HrWUGbr4wy4GVDTbf4&usqp=CAU"
            alt="Test"
          />
          <p id="commentaire">
            Choisisez une difficulté : Normal, Hoffmann ou GIT ADD *
          </p>
        </div>
      </div>
    </>
  );
};
function Resume(texte, url) {
  document.getElementById("commentaire").innerHTML = texte;
  document.getElementById("ImageDifficulte").src = url;
}

function GameSelection(props) {
    /* --- State of player choice --- */
    const [difficulty, setDifficulty] = useState();
    const [heroChosen, setHeroChosen] = useState();
    const [packChosen, setPackChosen] = useState();

    /* --- State of entities list --- */
    const [heroes, setHeroes] = useState([]);
    const [monsters, setMonsters] = useState([]);

    const [packMonster, setPackMonster] = useState();
    const [loading, setLoading] = useState(false);

    /**
     * Get the entities list
     * @param {string} entity Type of entity
     */
    const getAllEntities = (entity) => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_BASEURL}/entities/${entity}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((jsonData) =>
                entity === "heroes"
                    ? setHeroes(jsonData)
                    : entity === "monsters"
                    ? setMonsters(jsonData)
                    : ""
            )
            .finally(() => setLoading(false));
    };

    const handleHeroChoice = (heroChoice) => {
        allMonsterPack();
        setHeroChosen(heroChoice);
    };

    const allMonsterPack = () => {
        let allPack = [];

        for (let j = 0; j < 4; j++) {
            let setOnePack = [];

            for (let i = 0; i < 5; i++) {
                const rndPick = Math.floor(Math.random() * monsters.length);
                setOnePack.push(monsters[rndPick]);
            }
            allPack.push(setOnePack);
        }

        setPackMonster(allPack);
    };

    const monsterStatsDifficulty = () => {
        if (difficulty === "normal") {
            let bossMonsterStats = packChosen[4].stats;

            for (const key in bossMonsterStats) {
                if (Object.hasOwnProperty.call(bossMonsterStats, key) && key !== "pa") {
                    bossMonsterStats[key] += 25;
                }
            }
        } else {
            for (let i = 0; i < packChosen.length; i++) {
                let monsterStats = packChosen[i].stats;

                for (const key in monsterStats) {
                    if (Object.hasOwnProperty.call(monsterStats, key) && key !== "pa") {
                        if (i === packChosen.length - 1) {
                            monsterStats[key] += 30;
                        } else if (i >= packChosen.length - 3) {
                            monsterStats[key] += 15;
                        } else {
                            monsterStats[key] += 5;
                        }
                    }
                }
            }
        }
    };

    const handlePackChoice = (packChoice) => {
        setPackChosen(packChoice);
    };

    useEffect(() => {
        getAllEntities("heroes");
        getAllEntities("monsters");
    }, []);

    if (loading) {
        return (
            <>
                <p>Please wait a moment...</p>
            </>
        );
    }

    setPackMonster(allPack);
  };

  const handlePackChoice = (packChoice) => {
    setPackChosen(packChoice);
  };

    if (!packChosen) {
        let packNumber = 1;

        return (
            <>
                {packMonster.map((e) => (
                    <div key={"pack-" + packNumber} onClick={() => handlePackChoice(e)}>
                        Pack Monster {packNumber++}
                    </div>
                ))}
            </>
        );
    }

    monsterStatsDifficulty();

    return (
      <>
        {packMonster.map((e) => (
          <div key={"pack-" + packNumber} onClick={() => handlePackChoice(e)}>
            Pack Monster {packNumber++}
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      <HeroCard hero={heroChosen} />
      <p>VERSUS</p>
      {packChosen.map((e, index) => (
        <div key={index + "-" + e._id}>
          <HeroCard hero={e} />
        </div>
      ))}
      <Link
        to="/play"
        state={{
          heroChosen: heroChosen,
          packMonster: packChosen,
          difficultyChosen: difficulty,
        }}
      >
        <button>Okay Let's go !</button>
      </Link>
    </>
  );
}

export default GameSelection;
