<script>
    import { page } from "$app/stores";
    import {
        SPELL_CLASS_FILTER_KEY,
        SPELL_INPUT_FILTER_KEY,
        SPELL_LEVEL_FILTER_KEY,
        SPELL_SCHOOL_FILTER_KEY,
    } from "$lib/searchParamKeys.js";
    import {
        getSchoolColor,
        setClassFilter,
        setInputSearchFilter,
        setSchoolFilter,
        setSpellLevelFilter,
    } from "$lib/utils.js";
    import { onMount } from "svelte";

    export let data;

    // Input search by name
    /** @type {string} */
    $: searchInput = $page.url.searchParams.get(SPELL_INPUT_FILTER_KEY) || "";

    // Schools
    /** @type {string[]} */
    $: schoolFilters = $page.url.searchParams.getAll(SPELL_SCHOOL_FILTER_KEY);

    // SpellLevels
    $: spellLevels = [...new Set(data.spells.map((spell) => spell.level))].sort();

    /** @type {number[]} */
    $: spellLevelFilters = $page.url.searchParams
        .getAll(SPELL_LEVEL_FILTER_KEY)
        .map((value) => +value);

    // Classes
    $: classes = [
        ...new Set(data.spells.map((spell) => spell.classes.map((value) => value.index)).flat()),
    ];

    /** @type {string[]} */
    $: classesFilters = $page.url.searchParams.getAll(SPELL_CLASS_FILTER_KEY);

    $: filteredSpells = data.spells
        .filter((spell) => spell.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()))
        .filter((spell) => schoolFilters.length === 0 || schoolFilters.includes(spell.school.index))
        .filter(
            (spell) => spellLevelFilters.length === 0 || spellLevelFilters.includes(spell.level)
        )
        .filter(
            (spell) =>
                classesFilters.length === 0 ||
                spell.classes.find((charClass) => classesFilters.includes(charClass.index))
        );
</script>

<div class="w-full h-full p-4 box-border overflow-auto grid grid-cols-[20rem,auto] gap-4">
    <!-- Sidebar -->
    <div
        class="bg-[#fff]/[0.04] p-4 rounded-lg overflow-auto h-full box-border inline-flex flex-col gap-8 transition-colors hover:bg-[#fff]/[0.05]"
    >
        <div class="flex justify-between">
            <h1 class="text-3xl">Filter</h1>

            <span>
                <a
                    href="/"
                    class="px-2 py-1 rounded-md text-xs bg-[#fff]/[0.1] transition-transform hover:-translate-y-1 hover:bg-[#fff]/[0.2]"
                >
                    Clear filters
                </a>
            </span>
        </div>

        <!-- School Filter -->
        <div class="flex flex-col gap-4">
            <h2 class="text-lg">School</h2>

            <ul class="list-none m-0 p-0 flex gap-2 flex-wrap">
                {#each data.schools as school}
                    <li>
                        <button
                            style="--color-button: {school.color};"
                            class="px-2 py-1 rounded-md text-xs bg-[#fff]/[0.1] transition-transform hover:-translate-y-1 hover:bg-[#fff]/[0.2]"
                            class:!bg-[var(--color-button)]={schoolFilters.includes(school.index)}
                            class:text-[#000]={schoolFilters.includes(school.index)}
                            type="button"
                            on:click={() => {
                                setSchoolFilter($page.url.toString(), school.index);
                            }}
                        >
                            {school.name}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>

        <!-- Spell Level Filter -->
        <div class="flex flex-col gap-4">
            <h2 class="text-lg">Spell Level</h2>

            <ul class="list-none m-0 p-0 flex gap-2 flex-wrap">
                {#each spellLevels as level}
                    <li>
                        <button
                            type="button"
                            class="px-2 py-1 rounded-md text-xs bg-[#fff]/[0.1] transition-transform hover:-translate-y-1 hover:bg-[#fff]/[0.2]"
                            class:!bg-[var(--color-primary)]={spellLevelFilters.includes(level)}
                            on:click={() => {
                                setSpellLevelFilter($page.url.toString(), level);
                            }}
                        >
                            {level !== 0 ? level : "Cantrip"}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>

        <!-- Classes Filter -->
        <div class="flex flex-col gap-4">
            <h2 class="text-lg">Classes</h2>

            <ul class="list-none m-0 p-0 flex gap-2 flex-wrap">
                {#each classes as classIndex}
                    {@const name = /** @type {Record<string, { name: string }>} */ (data.classes)[
                        classIndex
                    ].name}
                    <li>
                        <button
                            type="button"
                            class="px-2 py-1 rounded-md text-xs bg-[#fff]/[0.1] transition-transform hover:-translate-y-1 hover:bg-[#fff]/[0.2]"
                            class:!bg-[var(--color-primary)]={classesFilters.includes(classIndex)}
                            on:click={() => {
                                setClassFilter($page.url.toString(), classIndex);
                            }}
                        >
                            {name}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-4 h-full overflow-auto">
        <div
            class="bg-[#fff]/[0.04] flex justify-between items-center py-4 px-6 rounded-lg text-sm hover:bg-[#fff]/[0.05]"
        >
            <div class="flex flex-1 items-center gap-4">
                <input
                    type="text"
                    class="bg-[#fff]/[0.02] rounded-md p-2 w-full max-w-[18rem] hover:bg-[#fff]/[0.04] placeholder:italic placeholder:text-[#fff]/[0.1] hover:shadow-inner focus-within:outline-none"
                    placeholder="Search by name"
                    value={searchInput}
                    on:input={(event) => {
                        if (event.target) {
                            setInputSearchFilter(
                                $page.url.toString(),
                                /** @type HTMLInputElement */ (event.target).value
                            );
                        }
                    }}
                />
            </div>

            <div class="flex-1 flex justify-end">
                <div>
                    Filtered spells:
                    <span class="text-[var(--color-accent)]">
                        {filteredSpells.length}
                    </span>
                </div>
            </div>
        </div>

        <ul
            class="list-none p-0 m-0 grid auto-rows-max grid-cols-[repeat(auto-fill,minmax(20rem,auto))] gap-4 overflow-auto"
        >
            {#each filteredSpells as spell}
                <li>
                    <a
                        href="/spell/{spell.index}"
                        class="py-4 px-6 bg-[#fff]/[0.08] rounded-lg h-full w-full flex gap-6 transition-transform hover:-translate-y-1 hover:bg-[#fff]/[0.1]"
                    >
                        <div
                            style="--color-school: {getSchoolColor(spell.school.index)}"
                            class="h-full aspect-square bg-[var(--color-school)] rounded-md flex items-center"
                        ></div>

                        <div class="flex-1 text-left">
                            <h2 class="font-bold">{spell.name}</h2>

                            <div>
                                <div class="text-xs text-[var(--color-accent)]">
                                    Level: {spell.level !== 0 ? spell.level : "Cantrip"}
                                </div>

                                <div class="text-xs text-[var(--color-accent)]">
                                    School: {spell.school.name}
                                </div>
                            </div>
                        </div>
                    </a>
                </li>
            {/each}
        </ul>
    </div>
</div>
