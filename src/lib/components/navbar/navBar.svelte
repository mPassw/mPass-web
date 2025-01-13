<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index';
	import { BlurFade } from '@/animations/blurFade';
	import { Button, buttonVariants } from '../ui/button';
	import { mode, toggleMode } from 'mode-watcher';
	import Icon from '@iconify/svelte';
	import { userState } from '@/state/userState.svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let isSheetOpen: boolean = $state(false);

	const buttons = [
		{
			name: 'Download',
			icon: 'lucide:download',
			href: '/download'
		},
		{
			name: 'Resources',
			icon: 'lucide:book-open-text',
			href: '/resources'
		},
		{
			name: 'Generator',
			icon: 'lucide:key-round',
			href: '/generator'
		},
		{
			name: 'Dashboard',
			icon: 'lucide:layout-dashboard',
			href: '/dashboard'
		}
	];

	const logOut = () => {
		userState.reset();
		goto('/auth');
		toast.success('Logged out');
		isSheetOpen = false;
	};
</script>

<header
	class="fixed top-0 z-50 flex w-full select-none flex-nowrap border-b bg-transparent px-2 backdrop-blur-md"
>
	<BlurFade
		delay={0.1}
		once
		class="mx-auto flex h-[50px] w-full max-w-[1000px] items-center justify-between px-3"
	>
		<a href="/" class="text-2xl font-semibold tracking-tight">mPass</a>
		<nav class="hidden flex-row items-center gap-1 md:flex">
			{#each buttons as button}
				<Button variant="link" href={button.href}>
					<Icon icon={button.icon} font-size="20" />
					{button.name}
				</Button>
			{/each}
			<Button variant="ghost" size="icon" onclick={toggleMode}>
				<Icon icon={$mode === 'dark' ? 'lucide:moon' : 'lucide:sun'} font-size="20" />
			</Button>
			{#if userState.authState === 'loggedIn'}
				<Button variant="ghost" size="icon" class="md:flex xl:hidden" onclick={logOut}>
					<Icon icon="lucide:log-out" font-size="20" />
				</Button>
			{/if}
		</nav>
		<nav class="flex-row items-center gap-1 md:hidden">
			<Sheet.Root bind:open={isSheetOpen}>
				<Sheet.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
					<Icon icon="lucide:menu" font-size="20" />
				</Sheet.Trigger>
				<Sheet.Content>
					<Sheet.Header>
						<Sheet.Title class="mb-2">Menu</Sheet.Title>
					</Sheet.Header>
					<div class="flex w-full flex-col space-y-2">
						{#each buttons as button}
							<Button
								variant="ghost"
								href={button.href}
								class="w-full justify-start"
								onclick={() => (isSheetOpen = false)}
							>
								<Icon icon={button.icon} font-size="20" />
								{button.name}
							</Button>
						{/each}
						<Button variant="ghost" onclick={toggleMode} class="w-full justify-start">
							<Icon icon={$mode === 'dark' ? 'lucide:moon' : 'lucide:sun'} font-size="20" />
							Toggle Theme
						</Button>
						{#if userState.authState === 'loggedIn'}
							<Button variant="ghost" onclick={logOut} class="w-full justify-start">
								<Icon icon="lucide:log-out" font-size="20" />
								Logout
							</Button>
						{/if}
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</nav>
	</BlurFade>
</header>
