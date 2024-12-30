<script>
	import { mode } from 'mode-watcher';
</script>

<nav class="flex h-full flex-row items-center">
	<a
		href="/"
		class="animate-shine flex
        {$mode === 'dark'
			? 'bg-[linear-gradient(110deg,#ffffff,45%,#1e2631,55%,#ffffff)]'
			: 'bg-[linear-gradient(110deg,#000000,45%,#ffffff,55%,#000000)]'}
        bg-[length:200%_100%]
        bg-clip-text text-2xl font-semibold tracking-tight text-transparent">mPass</a
	>
</nav>
