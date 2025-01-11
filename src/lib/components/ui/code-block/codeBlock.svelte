<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Button } from '../button';
	import Icon from '@iconify/svelte';

	let { language, code }: { language: string; code: string } = $props();
	let codeLines = code.split('\n');

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(code);
		toast.success('Copied to clipboard');
	};
</script>

<div class="relative my-1 flex flex-col rounded-md bg-muted p-2 px-3">
	<Button variant="ghost" size="icon" class="absolute right-0 top-0" onclick={copyToClipboard}>
		<Icon icon="lucide:copy" />
	</Button>
	<p class="mb-2 select-none text-[12px]">{language}</p>
	{#each codeLines as codeLine}
		<code class="font-mono">{codeLine}</code>
	{/each}
</div>
