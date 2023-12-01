import spells from "$lib/data/spells.json";
import schools from "$lib/data/schools.json";
import classes from "$lib/data/classes.json";

export const load = () => {
    return {
        spells,
        schools,
        classes,
    };
};
