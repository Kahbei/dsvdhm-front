import "./GameTitle.css";
import templier from "./TemplierMainPage.png";
import { Link } from "react-router-dom";
function GameTitle(props) {
  return (
    <div class="gitadd">
      <h1 class="Titre">Die Suche von die Hoff Mann</h1>
      <img id="templier" src={templier} alt="Templier qui prie" />
      <div class="bouton">
        <Link to="/start">Start the game</Link>
        <Link to="/characters-builder">Ruler designer</Link>
      </div>
    </div>
  );
}

export default GameTitle;
