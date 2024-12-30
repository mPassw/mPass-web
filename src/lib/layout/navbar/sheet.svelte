<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import Icon from '@iconify/svelte';
	import { toggleMode } from 'mode-watcher';
</script>

<Sheet.Root>
	<Sheet.Trigger class={buttonVariants({ variant: 'link', size: 'icon' })}>
		<Icon icon="lucide:menu" font-size="20px" />
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<nav class="flex flex-col gap-4">
				<p class="self-center text-lg font-semibold text-foreground">Menu</p>
				<div class="flex w-full flex-col gap-2">
					<Button variant="ghost" href="/dashboard" class="flex items-center justify-start gap-2">
						<Icon icon="lucide:code-xml" font-size="20px" />
						Dashboard
					</Button>
					<Button
						variant="ghost"
						onclick={toggleMode}
						class="flex items-center justify-start gap-2"
					>
						<Icon icon="lucide:moon" font-size="20px" />
						Change Theme
					</Button>
				</div>
			</nav>
			<Separator />
			<nav class="flex flex-col gap-2">
				<p class="self-center text-lg font-semibold text-foreground">Downloads</p>
				<div class="flex w-full flex-col gap-2">
					<Button
						variant="ghost"
						href="/downloads/browser"
						class="flex items-center justify-start gap-2"
					>
						<Icon icon="lucide:globe" font-size="20px" />
						Browser Extension
					</Button>
					<Button
						href="/downloads/desktop"
						variant="ghost"
						onclick={toggleMode}
						class="flex items-center justify-start gap-2"
					>
						<Icon icon="lucide:monitor" font-size="20px" />
						Destop App
					</Button>
					<Button
						href="/downloads/android"
						variant="ghost"
						onclick={toggleMode}
						class="flex items-center justify-start gap-2"
					>
						<Icon icon="cib:android" font-size="20px" />
						Android App
					</Button>
					<Button
						href="/downloads/ios"
						variant="ghost"
						onclick={toggleMode}
						class="flex items-center justify-start gap-2"
					>
						<Icon icon="cib:apple" font-size="20px" />
						iOS App
					</Button>
				</div>
			</nav>
			<Separator />
			<nav class="flex flex-col gap-2">
				<p class="self-center text-lg font-semibold text-foreground">Resources</p>
				<div class="flex w-full flex-col gap-2">
					<Button variant="ghost" href="/docs" class="flex items-center justify-start gap-2">
						<Icon icon="lucide:book-open-text" font-size="20px" />
						Documentation
					</Button>
					<Button
						href="https://github.com/mPassw/"
						target="_blank"
						variant="ghost"
						onclick={toggleMode}
						class="flex items-center justify-start gap-2"
					>
						<Icon icon="lucide:github" font-size="20px" />
						GitHub
					</Button>
				</div>
			</nav>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>
