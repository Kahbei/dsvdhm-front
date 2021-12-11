import "./CUForm.css";

function CUForm(props) {
    if (props.entity) {
        const entity = props.entity;
        if (!entity.stats) {
            return (
                <>
                    <p>Please wait</p>
                </>
            );
        }

        return (
            <>
                <label htmlFor="entityImg">Image (lien URL) : </label>
                <input type="url" name="entityImg" defaultValue={entity.image} />

                <label htmlFor="entityName">Nom : </label>
                <input type="text" name="entityName" defaultValue={entity.name} required />

                <label htmlFor="statsPV">Points de vie : </label>
                <input
                    type="number"
                    min="100"
                    max="999"
                    name="statsPV"
                    defaultValue={entity.stats.pv}
                    required
                />

                <label htmlFor="statsPA">Points de l'Ankou : </label>
                <input
                    type="number"
                    min="0"
                    max="10"
                    step="2"
                    name="statsPA"
                    defaultValue={
                        entity.stats.pa !== 0 && entity.stats.pa % 2 !== 0
                            ? entity.stats.pa + 1
                            : entity.stats.pa
                    }
                    required
                />

                <label htmlFor="statsAttaque">Attaque : </label>
                <input
                    type="number"
                    min="10"
                    max="99"
                    name="statsAttaque"
                    defaultValue={entity.stats.attaque}
                    required
                />

                <label htmlFor="statsDefense">Défense : </label>
                <input
                    type="number"
                    min="10"
                    max="99"
                    name="statsDefense"
                    defaultValue={entity.stats.defense}
                    required
                />

                <label htmlFor="statsChance">Chance : </label>
                <input
                    type="number"
                    min="10"
                    max="99"
                    name="statsChance"
                    defaultValue={entity.stats.chance}
                    required
                />

                <label>Capacités : </label>

                <label htmlFor="capaciteAttaque">Attaque normale : </label>
                <input
                    type="number"
                    min="10"
                    max="99"
                    name="capaciteAttaque"
                    defaultValue={entity.capacite.attaque}
                    required
                />

                <label htmlFor="capaciteAttaqueSpecial">Attaque spéciale : </label>
                <input
                    type="number"
                    min="10"
                    max="99"
                    name="capaciteAttaqueSpecial"
                    defaultValue={entity.capacite.attaqueSpecial}
                    required
                />

                <label htmlFor="capaciteProtection">Protection : </label>
                <input
                    type="number"
                    min="10"
                    max="99"
                    name="capaciteProtection"
                    defaultValue={entity.capacite.protection}
                    required
                />
            </>
        );
    }

    return (
        <>
            <label htmlFor="entityImg">Image (lien URL) : </label>
            <input type="url" name="entityImg" />

            <label htmlFor="entityName">Nom : </label>
            <input type="text" name="entityName" required />

            <label htmlFor="statsPV">Points de vie : </label>
            <input type="number" min="100" max="999" name="statsPV" required />

            <label htmlFor="statsPA">Points de l'Ankou : </label>
            <input type="number" min="0" max="10" step="2" name="statsPA" required />

            <label htmlFor="statsAttaque">Attaque : </label>
            <input type="number" min="10" max="99" name="statsAttaque" required />

            <label htmlFor="statsDefense">Défense : </label>
            <input type="number" min="10" max="99" name="statsDefense" required />

            <label htmlFor="statsChance">Chance : </label>
            <input type="number" min="10" max="99" name="statsChance" required />

            <label>Capacités : </label>

            <label htmlFor="capaciteAttaque">Attaque normale : </label>
            <input type="number" min="10" max="99" name="capaciteAttaque" required />

            <label htmlFor="capaciteAttaqueSpecial">Attaque spéciale : </label>
            <input type="number" min="10" max="99" name="capaciteAttaqueSpecial" required />

            <label htmlFor="capaciteProtection">Protection : </label>
            <input type="number" min="10" max="99" name="capaciteProtection" required />
        </>
    );
}

export default CUForm;
