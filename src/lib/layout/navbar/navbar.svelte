<script lang="ts">
	import { BlurFade } from '$lib/components/animations/blurFade';
	import { Dashboard, Downloads, Logo, Resources, Sheet, ThemeSwitcher } from '.';
</script>

<header
	class="fixed top-0 z-50 flex w-full select-none flex-nowrap border-b bg-transparent px-2 backdrop-blur-md"
>
	<BlurFade
		delay={0.25}
		once
		class="mx-auto flex h-[50px] w-full max-w-[1000px] items-center justify-between"
	>
		<Logo />
		<BlurFade delay={0.5} once>
			<nav class="hidden flex-row items-center gap-2 md:flex">
				<Downloads />
				<Resources />
			</nav>
		</BlurFade>
		<BlurFade delay={0.75} once>
			<nav class="hidden flex-row items-center gap-2 md:flex">
				<Dashboard />
				<ThemeSwitcher />
			</nav>
		</BlurFade>
		<BlurFade delay={0.75} once class="flex md:hidden">
			<nav>
				<Sheet />
			</nav>
		</BlurFade>
	</BlurFade>
</header>
