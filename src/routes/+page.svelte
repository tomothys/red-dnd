<script>
    import spells from "$lib/data/spells.json";
    import schools from "$lib/data/schools.json";

    // Schools
    /** @type {string[]} */
    let setSchoolFilters = [];

    // SpellLevels
    $: spellLevels = [...new Set(spells.map((spell) => spell.level))].sort();

    /** @type {number[]} */
    let setSpellLevelFilters = [];

    // Classes
    $: classes = [
        ...new Set(spells.map((spell) => spell.classes.map((value) => value.index)).flat()),
    ];

    /** @type {string[]} */
    let setClassesFilters = [];
    $: console.log("setClassesFilters", setClassesFilters);

    $: filteredSpells = spells
        .filter(
            (spell) =>
                setSchoolFilters.length === 0 || setSchoolFilters.includes(spell.school.index)
        )
        .filter(
            (spell) =>
                setSpellLevelFilters.length === 0 || setSpellLevelFilters.includes(spell.level)
        )
        .filter(
            (spell) =>
                setClassesFilters.length === 0 ||
                spell.classes.find((magicClass) => setClassesFilters.includes(magicClass.index))
        );

    /**
     * @param {string} schoolValue
     */
    function getSchoolColor(schoolValue) {
        return schools.find((school) => school.value === schoolValue)?.color || "#f0f0f0";
    }
</script>

<div class="w-full h-full p-4 box-border overflow-auto grid grid-cols-[20rem,auto] gap-4">
    <!-- Sidebar -->
    <div
        class="bg-[#fff]/[0.04] p-4 rounded-lg flex flex-col gap-8 transition-colors hover:bg-[#fff]/[0.05]"
    >
        <h1 class="text-3xl">Filter</h1>

        <div class="flex flex-col gap-4">
            <h2 class="text-lg">School</h2>

            <ul class="list-none m-0 p-0 flex gap-2 flex-wrap">
                {#each schools as school}
                    <li>
                        <button
                            style="--color-button: {school.color};"
                            class="px-2 py-1 rounded-md text-xs bg-[#fff]/[0.1] transition-transform hover:-translate-y-1 hover:bg-[#fff]/[0.2]"
                            class:!bg-[var(--color-button)]={setSchoolFilters.includes(
                                school.value
                            )}
                            class:text-[#000]={setSchoolFilters.includes(school.value)}
                            type="button"
                            on:click={() => {
                                if (setSchoolFilters.includes(school.value)) {
                                    setSchoolFilters = setSchoolFilters.filter(
                                        (filterValue) => filterValue !== school.value
                                    );
                                } else {
                                    setSchoolFilters = [...setSchoolFilters, school.value];
                                }
                            }}>{school.label}</button
                        >
                    </li>
                {/each}
            </ul>
        </div>

        <div class="flex flex-col gap-4">
            <h2 class="text-lg">Spelllevel</h2>

            <ul class="list-none m-0 p-0 flex gap-2 flex-wrap">
                {#each spellLevels as level}
                    <li>
                        <button
                            type="button"
                            class="px-2 py-1 rounded-md text-xs bg-[#fff]/[0.1] transition-transform hover:-translate-y-1 hover:bg-[#fff]/[0.2]"
                            class:!bg-[var(--color-primary)]={setSpellLevelFilters.includes(level)}
                            on:click={() => {
                                if (setSpellLevelFilters.includes(level)) {
                                    setSpellLevelFilters = setSpellLevelFilters.filter(
                                        (spellLevel) => spellLevel !== level
                                    );
                                } else {
                                    setSpellLevelFilters = [...setSpellLevelFilters, level];
                                }
                            }}
                        >
                            {level !== 0 ? level : "Cantrip"}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="flex flex-col gap-4">
            <h2 class="text-lg">Spelllevel</h2>

            <ul class="list-none m-0 p-0 flex gap-2 flex-wrap">
                {#each classes as magicClass}
                    <li>
                        <button
                            type="button"
                            class="px-2 py-1 rounded-md text-xs bg-[#fff]/[0.1] transition-transform hover:-translate-y-1 hover:bg-[#fff]/[0.2]"
                            class:!bg-[var(--color-primary)]={setClassesFilters.includes(
                                magicClass
                            )}
                            on:click={() => {
                                if (setClassesFilters.includes(magicClass)) {
                                    setClassesFilters = setClassesFilters.filter(
                                        (filteredClass) => filteredClass !== magicClass
                                    );
                                } else {
                                    setClassesFilters = [...setClassesFilters, magicClass];
                                }
                            }}
                        >
                            {magicClass}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-4">
        <div
            class="min-h-[3rem] bg-[#fff]/[0.04] flex py-4 px-6 rounded-lg text-sm hover:bg-[#fff]/[0.05]"
        >
            <span>
                Filtered spell count:
                <span class="text-[var(--color-accent)]">
                    {filteredSpells.length}
                </span>
            </span>
        </div>

        <ul
            class="list-none p-0 m-0 grid auto-rows-max grid-cols-[repeat(auto-fill,minmax(20rem,auto))] gap-4"
        >
            {#each filteredSpells as spell}
                <li>
                    <button
                        type="button"
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
                    </button>
                </li>
            {/each}
        </ul>
    </div>
</div>
