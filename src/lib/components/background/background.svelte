<script>
	import { mode } from 'mode-watcher';
	import DotPattern from './dotPattern.svelte';
	import Particles from './particles.svelte';
</script>

<DotPattern
	class="fixed left-0 top-0 -z-50 [mask-image:radial-gradient(200px_circle_at_center,white,transparent)] md:[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] lg:[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
	fillColor={$mode === 'dark' ? 'rgb(163 163 163 / 0.25)' : 'rgb(0 0 0 / 0.25)'}
/>

{#if $mode === 'dark'}
	<Particles
		className="fixed -z-50 top-0 left-0 w-full h-screen pointer-events-none select-none"
		staticity={75}
		quantity={50}
		color="#ffffff"
	/>
{:else}
	<Particles
		className="fixed -z-50 top-0 left-0 w-full h-screen pointer-events-none select-none"
		staticity={75}
		quantity={50}
		color="#000000"
	/>
{/if}
