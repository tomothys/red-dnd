<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let id: string;
    export let options: { value: string; label: string }[];
    export let selectedValue: string = "";

    const dispatch = createEventDispatcher<{
        change: { value: string };
    }>();

    function getLabel(value: typeof selectedValue) {
        return options.find((option) => option.value === value)?.label ?? "---";
    }
</script>

<div
    class="
        custom-select
        inline-grid
        gap-1
        bg-[#fff]/[0.06]
        rounded-md
        hover:bg-[#fff]/[0.08]
        grid-cols-1
        grid-rows-1
    "
>
    <div
        class="
            border-box
            py-2
            pl-2
            pr-1
            content
            flex
            items-center
            gap-1
            col-start-1
            col-end-2
            row-start-1
            row-end-2
            justify-between
        "
    >
        <span>{getLabel(selectedValue)}</span>
        <span class="material-icon text-[1.25rem]">expand_more</span>
    </div>

    <select
        {id}
        class="
            border-box
            py-2
            pl-2
            pr-1
            h-full
            w-full
            opacity-0
            col-start-1
            col-end-2
            row-start-1
            row-end-2
            hover:cursor-pointer
        "
        on:change={(e) => {
            dispatch("change", { value: e.currentTarget.value });
        }}
    >
        {#each options as option}
            <option selected={option.value === selectedValue} value={option.value}>
                {option.label}
            </option>
        {/each}
    </select>
</div>
