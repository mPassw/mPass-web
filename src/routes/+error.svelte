<script>
	import { page } from '$app/state';
	import { Button } from '@/components/ui/button';
	import Icon from '@iconify/svelte';
</script>

<main class="flex h-screen w-full flex-col">
	<div class="m-auto flex flex-col items-center">
		{#if page.status === 404}
			<h2 class="text-3xl font-semibold tracking-tight">Page not found</h2>
		{:else}
			<h2 class="text-3xl font-semibold tracking-tight">Internal server error</h2>
		{/if}
		<Button class="mt-2" variant="secondary" href="/">
			<Icon icon="lucide:house" font-size="18px" />
			<span>Main page</span>
		</Button>
	</div>
</main>
