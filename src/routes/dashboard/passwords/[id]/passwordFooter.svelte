<script lang="ts">
	import type { Password } from '@/state/passwordsState.svelte';

	let { password }: { password: Password } = $props();
</script>

<div class="rounded-md border bg-white p-4 dark:bg-black">
	<div class="flex flex-col gap-1.5">
		<p class="text-sm text-muted-foreground">
			Password ID: {password.id}
		</p>
		<p class="text-sm text-muted-foreground">
			Created: {new Date(password.createdAt).toLocaleString()}
		</p>
		{#if password.updatedAt}
			<p class="text-sm text-muted-foreground">
				Updated: {new Date(password.updatedAt).toLocaleString()}
			</p>
		{/if}
	</div>
</div>
