<script lang="ts">
	import mPassOutline from '@/assets/mPass-outline.svg';
	import { BlurFade } from '@/components/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import Icon from '@iconify/svelte';
</script>

<main class="flex h-screen w-full overflow-auto">
	<div
		class="m-auto flex w-full max-w-[1000px] flex-row items-center justify-center space-x-4 px-4"
	>
		<div
			class="ml-4 flex w-2/3 select-none flex-col items-center text-center lg:items-start lg:text-start"
		>
			<BlurFade delay={0.5} once>
				<h1 class="text-4xl font-bold tracking-tight transition-colors">
					Your Server, Your Passwords
				</h1>
			</BlurFade>
			<BlurFade delay={0.6} once>
				<p class="text-muted-foreground">
					Take control of your digital identity with <span class="font-bold">mPass</span>. Our free
					and open-source solution lets you self-host your password vault, ensuring maximum privacy
				</p>
			</BlurFade>
			<div class="mt-4 flex space-x-2">
				<BlurFade delay={0.7} once>
					<Button href="/docs">
						<Icon icon="lucide:book-open-text" />
						Self-Host
					</Button>
				</BlurFade>
				<BlurFade delay={0.8} once>
					<Button variant="secondary" href="/downloads">
						<Icon icon="lucide:download" />
						Download
					</Button>
				</BlurFade>
			</div>
		</div>
		<BlurFade delay={0.9} once>
			<img src={mPassOutline} alt="mPass" class="hidden h-[350px] w-[350px] dark:invert lg:block" />
		</BlurFade>
	</div>
</main>
