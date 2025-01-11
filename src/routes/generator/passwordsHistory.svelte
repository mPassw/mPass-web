<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { CHARSET, NUMBERSET, SPECIALSET } from '@/passwords/generator.svelte';
	import { passwordGeneratorState } from '@/state/passwordGeneratorState.svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
</script>

<div class="flex h-full w-full flex-col gap-2">
	<div class="flex flex-row items-center justify-between">
		<p class="font-medium tracking-tight">Last 100 generated passwords</p>
		<Button variant="destructive" onclick={() => passwordGeneratorState.clearHistory()}>
			<Icon icon="lucide:trash" />
			<span>Clear history</span>
		</Button>
	</div>
	{#each passwordGeneratorState.passwordHistory as password}
		<button
			onclick={() => {
				navigator.clipboard.writeText(password.password);
				toast.success('Copied to clipboard');
			}}
			class="flex w-full flex-col flex-wrap items-start rounded-md border bg-white p-2 text-start shadow-sm duration-200 hover:bg-accent dark:bg-black dark:hover:bg-accent"
		>
			<div class="flex flex-row flex-wrap">
				{#each password.password.split('') as char}
					{#if CHARSET.includes(char)}
						<span>{char}</span>
					{:else if NUMBERSET.includes(char)}
						<span class="text-blue-600">{char}</span>
					{:else if SPECIALSET.includes(char)}
						<span class="text-red-600">{char}</span>
					{:else}
						<span>{char}</span>
					{/if}
				{/each}
			</div>
			<p class="text-sm text-muted-foreground">{new Date(password.date).toLocaleDateString()}</p>
		</button>
	{/each}
</div>
