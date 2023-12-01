<script>
    import { getSchoolColor } from "$lib/utils.js";

    export let data;

    console.log("data.selectedSpell", data.selectedSpell);
</script>

<div class="p-4 flex flex-col gap-4">
    <div
        class="min-h-[3rem] bg-[#fff]/[0.04] flex justify-between items-center py-4 px-6 rounded-lg text-sm hover:bg-[#fff]/[0.05]"
    >
        <div class="flex items-center gap-2">
            <div
                style="--color-school: {getSchoolColor(data.selectedSpell.school.index)}"
                class="w-4 aspect-square bg-[var(--color-school)] rounded-sm"
            ></div>

            <h1>{data.selectedSpell.name}</h1>
        </div>
    </div>

    <div class="flex gap-4">
        <div class="flex-1 bg-[#fff]/[0.04] py-4 px-6 rounded-lg text-sm hover:bg-[#fff]/[0.05]">
            <h2 class="font-bold">Description</h2>
            <br />
            {@html data.selectedSpell.desc.join("<br /><br />")}
        </div>

        <div class="flex-1 bg-[#fff]/[0.04] py-4 px-6 rounded-lg text-sm hover:bg-[#fff]/[0.05]">
            <!-- Casting time -->
            <div>
                Castingtime <span class="text-[var(--color-accent)]">
                    {data.selectedSpell.casting_time}
                </span>
            </div>

            <!-- Range / Area -->
            {#if data.selectedSpell.area_of_effect}
                {@const size = data.selectedSpell.area_of_effect.size}
                {@const type = data.selectedSpell.area_of_effect.type}

                <div>
                    Range / Area <span class="text-[var(--color-accent)]">
                        {size} / {type}
                    </span>
                </div>
            {/if}

            <!-- Components -->
            <div>
                Components <span class="text-[var(--color-accent)]">
                    {data.selectedSpell.components.join(", ")}
                </span>

                {#if data.selectedSpell.material}
                    <span class="text-[var(--color-accent)] text-xs">
                        ({data.selectedSpell.material})
                    </span>
                {/if}
            </div>

            <!-- Duration -->
            <div>
                Duration <span class="text-[var(--color-accent)]">
                    {data.selectedSpell.duration}
                </span>
            </div>
        </div>
    </div>
</div>
