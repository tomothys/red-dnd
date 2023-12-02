import { goto } from "$app/navigation";
import schools from "$lib/data/schools.json";
import {
    SPELL_CLASS_FILTER_KEY,
    SPELL_INPUT_FILTER_KEY,
    SPELL_LEVEL_FILTER_KEY,
    SPELL_SCHOOL_FILTER_KEY,
} from "./searchParamKeys";

/**
 * @param {string} schoolIndex
 */
export function getSchoolColor(schoolIndex) {
    return schools.find((school) => school.index === schoolIndex)?.color || "#f0f0f0";
}

/**
 * @param {string} currentUrl
 * @param {string} schoolValue
 */
export function setSchoolFilter(currentUrl, schoolValue) {
    const url = new URL(currentUrl);

    if (url.searchParams.has(SPELL_SCHOOL_FILTER_KEY, schoolValue)) {
        url.searchParams.delete(SPELL_SCHOOL_FILTER_KEY, schoolValue);
    } else {
        url.searchParams.append(SPELL_SCHOOL_FILTER_KEY, schoolValue);
    }

    goto(url.toString());
}

/** @type {number | undefined} debounceInputSearchId */
let debounceInputSearchId = undefined;
/**
 * @param {string} currentUrl
 * @param {string} input
 */
export function setInputSearchFilter(currentUrl, input) {
    const url = new URL(currentUrl);

    if (input === "") {
        url.searchParams.delete(SPELL_INPUT_FILTER_KEY);
    } else {
        url.searchParams.set(SPELL_INPUT_FILTER_KEY, input);
    }

    if (debounceInputSearchId !== undefined) {
        clearTimeout(debounceInputSearchId);
    }

    debounceInputSearchId = setTimeout(
        () => {
            goto(url.toString(), { keepFocus: true });
            debounceInputSearchId = undefined;
        },
        500,
        undefined
    );
}

/**
 * @param {string} currentUrl
 * @param {number} spellLevel
 */
export function setSpellLevelFilter(currentUrl, spellLevel) {
    const url = new URL(currentUrl);
    const levelAsString = spellLevel.toString();

    if (url.searchParams.has(SPELL_LEVEL_FILTER_KEY, levelAsString)) {
        url.searchParams.delete(SPELL_LEVEL_FILTER_KEY, levelAsString);
    } else {
        url.searchParams.append(SPELL_LEVEL_FILTER_KEY, levelAsString);
    }

    goto(url.toString());
}

/**
 * @param {string} currentUrl
 * @param {string} className
 */
export function setClassFilter(currentUrl, className) {
    const url = new URL(currentUrl);

    if (url.searchParams.has(SPELL_CLASS_FILTER_KEY, className)) {
        url.searchParams.delete(SPELL_CLASS_FILTER_KEY, className);
    } else {
        url.searchParams.append(SPELL_CLASS_FILTER_KEY, className);
    }

    goto(url.toString());
}
