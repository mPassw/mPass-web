<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Textarea } from '@/components/ui/textarea';
	import type { Password } from '@/state/passwordsState.svelte';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let { password, isLoading }: { password: Password; isLoading: boolean } = $props();

	const autoResize = (e: any) => {
		e.target.style.height = 'auto';
		e.target.style.height = e.target.scrollHeight + 'px';
	};

	onMount(() => {
		autoResize({ target: document.querySelector('textarea') });
	});
</script>

<div class="rounded-md border bg-white p-4 dark:bg-black">
	<div class="flex flex-col gap-1.5">
		<h2 class="text-start text-lg font-semibold">Note</h2>
		<Textarea disabled={isLoading} bind:value={password.note} oninput={autoResize} />
		<Button
			disabled={isLoading || !password.note}
			class="self-start"
			variant="link"
			onclick={async () => {
				if (password.note) {
					await navigator.clipboard.writeText(password.note);
					toast.success('Copied');
				}
			}}
		>
			<Icon icon="lucide:copy" font-size="18" />
			Copy
		</Button>
	</div>
</div>
