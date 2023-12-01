import spells from "$lib/data/spells.json";
import schools from "$lib/data/schools.json";

export const load = () => {
    return {
        spells,
        schools,
    };
};
