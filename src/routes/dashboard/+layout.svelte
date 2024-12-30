<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import { BlurFade } from '@/components/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { currentAuthState, instanceUrl, password, servicePasswords, userData } from '@/shared';
	import { getMe, type UserData } from '@/user';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let { children } = $props();

	const logOut = async () => {
		sessionStorage.removeItem('authToken');

		$currentAuthState = 'server';
		$userData = {} as UserData;
		$servicePasswords = [];
		$password = '';
		await goto('/auth');
	};

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
				<Button
					variant="ghost"
					class="flex justify-start {page.url.pathname === '/dashboard' ? 'bg-accent' : ''}"
				>
					<Icon icon="lucide:layout-dashboard" font-size="20px" />
					Overview
				</Button>
				<Button
					variant="ghost"
					class="flex justify-start {page.url.pathname === '/dashboard/passwords'
						? 'bg-accent'
						: ''}"
				>
					<Icon icon="material-symbols:password-rounded" font-size="20px" />
					Passwords
				</Button>
				<Button
					variant="ghost"
					class="flex justify-start {page.url.pathname === '/dashboard/settings'
						? 'bg-accent'
						: ''}"
				>
					<Icon icon="lucide:settings" font-size="20px" />
					Settings
				</Button>
				{#if $userData.admin}
					<Button
						variant="ghost"
						class="flex justify-start {page.url.pathname === '/dashboard/admi' ? 'bg-accent' : ''}"
					>
						<Icon icon="lucide:wrench" font-size="20px" />
						Admin
					</Button>
				{/if}
				<Button variant="ghost" class="flex justify-start" onclick={logOut}>
					<Icon icon="lucide:log-out" font-size="20px" />
					Log Out
				</Button>
			</BlurFade>
		</div>
		<div class="mt-14 flex w-full flex-col">
			{@render children()}
		</div>
	{/if}
</main>
