<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { getSchoolColor } from "$lib/utils.js";

    export let data;
</script>

<div class="p-4 flex flex-col gap-4">
    <div
        class="min-h-[3rem] bg-[#fff]/[0.04] flex justify-between items-center py-4 px-6 rounded-lg text-sm hover:bg-[#fff]/[0.05]"
    >
        <button
            type="button"
            on:click={() => {
                console.log(document.referrer);

                if (document.referrer.indexOf($page.url.host) !== -1) {
                    history.back();
                } else {
                    goto("/");
                }
            }}>Back to Spell List</button
        >

        <div class="flex items-center gap-2">
            <h1>{data.selectedSpell.name}</h1>

            <div
                style="--color-school: {getSchoolColor(data.selectedSpell.school.index)}"
                class="w-4 aspect-square bg-[var(--color-school)] rounded-sm"
            ></div>
        </div>
    </div>
</div>
