<script lang="ts">
	import { useMotionTemplate, useMotionValue, Motion } from 'svelte-motion';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	export let className: string | undefined = undefined;

	let mouseX = useMotionValue(0);
	let mouseY = useMotionValue(0);

	let randomString = '';

	onMount(() => {
		let str = generateRandomString(1500);
		randomString = str;
	});

	function onMouseMove({ currentTarget, clientX, clientY }: any) {
		let { left, top } = currentTarget.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);

		const str = generateRandomString(1500);
		randomString = str;
	}

	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const generateRandomString = (length: number) => {
		let result = '';
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return result;
	};

	let maskImage = useMotionTemplate`radial-gradient(150px at ${mouseX}px ${mouseY}px, white, transparent)`;
	let style = { maskImage, WebkitMaskImage: maskImage };
</script>

<div
	class={cn(
		'relative  flex aspect-square  h-full w-full items-center justify-center bg-transparent p-0.5',
		className
	)}
>
	<div
		on:mousemove={onMouseMove}
		role="none"
		class="group/card relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-transparent"
	>
		<div class="pointer-events-none">
			<div
				class="absolute inset-0 rounded-2xl [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50"
			></div>
			<Motion let:motion {style}>
				<div
					use:motion
					class="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-blue-700 opacity-0 backdrop-blur-xl transition duration-500 group-hover/card:opacity-100"
				></div>
			</Motion>
			<Motion let:motion {style}>
				<div
					use:motion
					class="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay group-hover/card:opacity-100"
				>
					<p
						class="absolute inset-x-0 h-full whitespace-pre-wrap break-words font-mono text-xs font-bold text-white transition duration-500"
					>
						{randomString}
					</p>
				</div>
			</Motion>
		</div>
	</div>
</div>
