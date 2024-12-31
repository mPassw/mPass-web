<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import * as Drawer from '$lib/components/ui/drawer/index';
	import { BlurFade } from '@/components/animations/blurFade';
	import { buttonVariants } from '@/components/ui/button';
	import { currentAuthState, instanceUrl, userData } from '@/shared';
	import { getMe } from '@/user';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import MenuButtons from './menuButtons.svelte';

	let { children } = $props();

	onMount(() => {
		if ($currentAuthState !== 'loggedin') {
			goto('/auth');
			return;
		}

		getMe($instanceUrl)
			.then((res) => ($userData = res))
			.catch(() => toast.error('error loading user data'));
	});
</script>

<main class="flex h-screen w-full justify-center">
	{#if $currentAuthState !== 'loggedin'}
		<div class="m-auto">
			<Icon icon="svg-spinners:pulse-multiple" font-size="64px" />
		</div>
	{:else}
		<Drawer.Root>
			<Drawer.Trigger
				class="fixed bottom-3 right-3 z-50 xl:hidden {buttonVariants({
					variant: 'outline',
					size: 'icon'
				})}"
			>
				<Icon icon="lucide:menu" font-size="20px" />
			</Drawer.Trigger>
			<Drawer.Content>
				<div class="my-3 flex w-full flex-col gap-2 px-2">
					<MenuButtons />
				</div>
			</Drawer.Content>
		</Drawer.Root>
		<div class="flex w-full max-w-[1400px]">
			<div class="mt-14 hidden w-1/6 flex-col gap-4 xl:flex">
				<BlurFade
					delay={0.2}
					once
					class="flex w-full flex-row items-center  space-x-2 rounded-lg p-4"
				>
					<div class="flex w-full flex-row items-center space-x-2">
						<Avatar.Root>
							<Avatar.Image src="" alt="@me" />
							<Avatar.Fallback>{$userData.email?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
						</Avatar.Root>
						<p class="truncate font-semibold">{$userData.email}</p>
					</div>
				</BlurFade>
				<BlurFade delay={0.3} once class="flex flex-col gap-2 px-2">
					<MenuButtons />
				</BlurFade>
			</div>
			<div class="mt-14 flex w-full flex-col">
				{@render children()}
			</div>
		</div>
	{/if}
</main>
