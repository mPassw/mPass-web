<script lang="ts">
	import '../app.css';

	import { mode, ModeWatcher } from 'mode-watcher';
	import { NavBar } from '@/components/navbar';
	import { Toaster } from '@/components/ui/sonner';
	import { Particles } from '@/animations/particles';
	import { BackgroundDots } from '@/components/background';
	import { onMount } from 'svelte';
	import { encryptor } from '@/state/passwordsState.svelte';

	let { children } = $props();

	onMount(async () => {
		await encryptor.init();
		await encryptor.loadWordsList();
	});
</script>

<ModeWatcher />
<Toaster richColors class="select-none" />
<BackgroundDots
	class="pointer-events-none fixed left-0 top-0 -z-50 h-screen w-full
    [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]
    lg:[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]
    xl:[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
	fillColor={$mode === 'dark' ? 'rgb(163 163 163 / 0.2)' : 'rgb(163 163 163 / 0.8)'}
/>

{#if $mode === 'dark'}
	<Particles
		className="fixed top-0 left-0 -z-50 pointer-events-none h-screen w-full"
		quantity={50}
	/>
{:else}
	<Particles
		className="fixed top-0 left-0 -z-50 pointer-events-none h-screen w-full"
		color="#000000"
		quantity={50}
	/>
{/if}

<NavBar />

{@render children()}
