import { error } from "@sveltejs/kit";

export const load = async ({ parent, params }) => {
    const parentData = await parent();

    const selectedSpell = parentData.spells.find((param) => param.index === params.spellIndex);

    if (!selectedSpell) {
        throw error(404, "Spell not found :(");
    }

    return {
        selectedSpell,
    };
};
