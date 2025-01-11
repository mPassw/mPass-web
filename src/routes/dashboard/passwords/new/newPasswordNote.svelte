<script lang="ts">
	import { Textarea } from '@/components/ui/textarea';
	import type { PasswordBase } from '@/state/passwordsState.svelte';

	let { newPassword, isLoading }: { newPassword: PasswordBase; isLoading: boolean } = $props();

	const autoResize = (e: any) => {
		e.target.style.height = 'auto';
		e.target.style.height = e.target.scrollHeight + 'px';
	};
</script>

<div class="flex w-full flex-col gap-2 rounded-md border bg-white p-4 dark:bg-black">
	<div class="flex flex-col gap-1.5">
		<h2 class="text-start text-lg font-semibold">Note</h2>
		<Textarea disabled={isLoading} bind:value={newPassword.note} oninput={autoResize} />
	</div>
</div>
