<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import {
        SPELL_CLASS_FILTER_KEY,
        SPELL_INPUT_FILTER_KEY,
        SPELL_LEVEL_FILTER_KEY,
        SPELL_SCHOOL_FILTER_KEY,
        SPELL_SELECTED_FILTER_KEY,
    } from "$lib/searchParamKeys.js";
    import {
        getSchoolColor,
        setClassFilter,
        setInputSearchFilter,
        setSchoolFilter,
        setSpellLevelFilter,
    } from "$lib/utils.js";

    export let data;

    // Input search by name
    $: searchInputFilter = $page.url.searchParams.get(SPELL_INPUT_FILTER_KEY) || "";

    // Schools
    $: schoolFilters = $page.url.searchParams.getAll(SPELL_SCHOOL_FILTER_KEY);

    // SpellLevels
    $: spellLevels = [...new Set(data.spells.map((spell) => spell.level))].sort();
    $: spellLevelFilters = $page.url.searchParams
        .getAll(SPELL_LEVEL_FILTER_KEY)
        .map((value) => +value);

    // Classes
    $: classIndices = [
        ...new Set(data.spells.map((spell) => spell.classes.map((value) => value.index)).flat()),
    ];
    $: classesFilters = $page.url.searchParams.getAll(SPELL_CLASS_FILTER_KEY);

    $: showClearFilterButton =
        classesFilters.length > 0 || spellLevelFilters.length > 0 || schoolFilters.length > 0;

    $: filteredSpells = data.spells
        .filter((spell) => {
            // TODO Maybe add fuzzy finding?
            return spell.name.toLocaleLowerCase().includes(searchInputFilter.toLocaleLowerCase());
        })
        .filter((spell) => schoolFilters.length === 0 || schoolFilters.includes(spell.school.index))
        .filter(
            (spell) => spellLevelFilters.length === 0 || spellLevelFilters.includes(spell.level)
        )
        .filter((spell) => {
            return (
                classesFilters.length === 0 ||
                spell.classes.find((charClass) => classesFilters.includes(charClass.index))
            );
        });

    $: selectedSpell = data.spells.find((spell) => {
        return spell.index === $page.url.searchParams.get(SPELL_SELECTED_FILTER_KEY);
    });

    /** @param {string} spellIndex */
    function getSpellDialogUrl(spellIndex) {
        const url = new URL($page.url.toString());
        url.searchParams.set(SPELL_SELECTED_FILTER_KEY, spellIndex);
        return url.toString();
    }
</script>

<div class="w-full h-full p-4 box-border overflow-auto grid grid-cols-[20rem,auto] gap-4">
    <!-- Sidebar -->
    <div
        class="bg-[#fff]/[0.06] p-4 rounded-lg overflow-auto h-full box-border inline-flex flex-col gap-8 transition-colors hover:bg-[#fff]/[0.08]"
    >
        <div class="flex justify-between items-center">
            <h1 class="text-3xl">Filter</h1>

            {#if showClearFilterButton}
                <span>
                    <a
                        href="/"
                        class="px-2 py-1 rounded-md text-xs bg-[#fff]/[0.1] transition-transform hover:-translate-y-1 hover:bg-[#fff]/[0.2]"
                    >
                        Clear filters
                    </a>
                </span>
            {/if}
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
                {#each classIndices as classIndex}
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
    <div class="flex flex-col gap-4 h-full overflow-auto isolate">
        <div
            class="bg-[#121011] flex justify-between items-center py-4 px-6 rounded-lg text-sm hover:bg-[#171516] sticky top-0 z-20"
        >
            <div class="flex flex-1 items-center gap-4">
                <input
                    type="text"
                    class="bg-[#fff]/[0.06] rounded-md p-2 w-full max-w-[18rem] hover:bg-[#fff]/[0.08] placeholder:italic placeholder:text-[#fff]/[0.1] hover:shadow-inner focus-within:outline-none"
                    placeholder="Search by name"
                    value={searchInputFilter}
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
            class="list-none p-0 m-0 grid auto-rows-max grid-cols-[repeat(auto-fill,minmax(20rem,auto))] gap-4"
        >
            {#each filteredSpells as spell}
                <li>
                    <a
                        href={getSpellDialogUrl(spell.index)}
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

<dialog
    open={Boolean(selectedSpell)}
    class="absolute top-0 left-0 box-border bg-[#fff]/[0.15] w-full h-full text-[var(--color-text)] open:flex open:items-center open:justify-center open:flex-col open:gap-4"
>
    {#if selectedSpell}
        <div
            class="p-4 flex flex-col gap-4 bg-[var(--color-background)] rounded-xl w-[80%] max-w-2xl max-h-[80%]"
        >
            <div
                class="min-h-[3rem] bg-[#fff]/[0.04] flex justify-between items-center py-4 px-6 rounded-lg text-sm hover:bg-[#fff]/[0.05]"
            >
                <div class="flex items-center gap-2">
                    <div
                        style="--color-school: {getSchoolColor(selectedSpell.school.index)}"
                        class="w-4 aspect-square bg-[var(--color-school)] rounded-sm"
                    ></div>

                    <h1>{selectedSpell.name}</h1>
                </div>

                <button
                    type="button"
                    on:click={() => {
                        const url = new URL($page.url);
                        url.searchParams.delete(SPELL_SELECTED_FILTER_KEY);
                        goto(url);
                    }}>X</button
                >
            </div>

            <div class="bg-[#fff]/[0.04] py-4 px-6 rounded-lg text-sm hover:bg-[#fff]/[0.05]">
                <!-- Casting time -->
                <div>
                    Castingtime <span class="text-[var(--color-accent)]">
                        {selectedSpell.casting_time}
                    </span>
                </div>

                <!-- Range / Area -->
                {#if selectedSpell.area_of_effect}
                    {@const size = selectedSpell.area_of_effect.size}
                    {@const type = selectedSpell.area_of_effect.type}

                    <div>
                        Range / Area <span class="text-[var(--color-accent)]">
                            {size} / {type}
                        </span>
                    </div>
                {/if}

                <!-- Components -->
                <div>
                    Components <span class="text-[var(--color-accent)]">
                        {selectedSpell.components.join(", ")}
                    </span>

                    {#if selectedSpell.material}
                        <span class="text-[var(--color-accent)] text-xs">
                            ({selectedSpell.material})
                        </span>
                    {/if}
                </div>

                <!-- Duration -->
                <div>
                    Duration <span class="text-[var(--color-accent)]">
                        {selectedSpell.duration}
                    </span>
                </div>
            </div>

            <div
                class="flex-1 bg-[#fff]/[0.04] py-4 px-6 rounded-lg text-sm hover:bg-[#fff]/[0.05] overflow-auto"
            >
                <h2 class="font-bold">Description</h2>
                <br />
                {@html selectedSpell.desc.join("<br /><br />")}
            </div>
        </div>
    {/if}
</dialog>
