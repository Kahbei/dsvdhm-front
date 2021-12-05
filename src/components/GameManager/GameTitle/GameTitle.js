import "./GameTitle.css";

function GameTitle(props) {
  return (
    <div class="gitadd">
      <h1 class="Titre">Die Suche von die Hoff Mann</h1>
      <img
        id="templier"
        src="https://www.cdiscount.com/pdt2/8/7/4/1/550x550/his2009948975874/rw/sticker-templier-en-priere.jpg"
        alt="Templier qui prie"
      />
      <div class="bouton">
        <a href="#" id="BoutonStart">
          Start
        </a>
        <a href="#" id="BontonRuledesignertext">
          Rule designer
        </a>
      </div>
    </div>
  );
}

export default GameTitle;
