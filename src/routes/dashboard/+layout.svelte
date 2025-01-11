<script lang="ts">
	import * as Avatar from '@/components/ui/avatar';
	import { goto } from '$app/navigation';
	import { BlurFade } from '@/animations/blurFade';
	import { userState } from '@/state/userState.svelte';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import MenuButtons from './menuButtons.svelte';
	import { getMe } from '@/user/getMe.svelte';
	import { getPasswords } from '@/passwords/getPasswords.svelte';
	import { toast } from 'svelte-sonner';
	import { passwordsState } from '@/state/passwordsState.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	let isLoadingUser: boolean = $state(true);
	let isLoadingPasswords: boolean = $state(true);

	onMount(async () => {
		if (userState.authState !== 'loggedIn') {
			await goto('/auth');
			return;
		}

		try {
			await getMe();
		} catch {
			toast.error('Failed to get user data');
		} finally {
			isLoadingUser = false;
		}

		if (passwordsState.passwords.length === 0) {
			try {
				await getPasswords();
			} catch {
				toast.error('Failed to get passwords');
			}
		}

		isLoadingPasswords = false;
	});
</script>

<div class="flex h-screen w-full justify-center">
	{#if userState.authState !== 'loggedIn' || isLoadingUser || isLoadingPasswords}
		<div class="m-auto">
			<Icon icon="svg-spinners:pulse-multiple" font-size="64px" />
		</div>
	{:else}
		<div
			class="fixed bottom-0 left-0 z-20 flex h-[60px] w-full flex-row border-t bg-white shadow-sm dark:bg-black xl:hidden"
		>
			<a
				href="/dashboard"
				class="flex h-full w-[20%] items-center justify-center {page.url.pathname === '/dashboard'
					? 'bg-accent'
					: ''}"
			>
				<Icon icon="material-symbols:password-rounded" font-size="20" />
			</a>
			<a
				href="/dashboard/trash"
				class="flex h-full w-[20%] items-center justify-center {page.url.pathname ===
				'/dashboard/trash'
					? 'bg-accent'
					: ''}"
			>
				<Icon icon="lucide:trash" font-size="20" />
			</a>
			<a
				href="/dashboard/import-export"
				class="flex h-full w-[20%] items-center justify-center {page.url.pathname ===
				'/dashboard/import-export'
					? 'bg-accent'
					: ''}"
			>
				<Icon icon="lucide:arrow-right-left" font-size="20" />
			</a>
			<a
				href="/dashboard/account"
				class="flex h-full w-[20%] items-center justify-center {page.url.pathname ===
				'/dashboard/account'
					? 'bg-accent'
					: ''}"
			>
				<Icon icon="lucide:user-round" font-size="20" />
			</a>
			{#if userState.isAdmin}
				<a
					href="/dashboard/admin"
					class="flex h-full w-[20%] items-center justify-center {page.url.pathname ===
					'/dashboard/admin'
						? 'bg-accent'
						: ''}"
				>
					<Icon icon="lucide:wrench" font-size="20" />
				</a>
			{/if}
		</div>
		<div class="flex w-full max-w-[1100px]">
			<div class="mt-14 hidden w-1/5 flex-col gap-1 xl:flex">
				<BlurFade
					delay={0.2}
					once
					class="flex w-full flex-row items-center space-x-2 rounded-lg p-4"
				>
					<div class="flex w-full flex-row items-center space-x-2">
						<Avatar.Root>
							<Avatar.Image src="" alt="@me" />
							<Avatar.Fallback>
								{userState.username?.slice(0, 2).toUpperCase() ??
									userState.email.slice(0, 2).toUpperCase()}
							</Avatar.Fallback>
						</Avatar.Root>
						<p class="truncate font-semibold">{userState.username ?? userState.email}</p>
					</div>
				</BlurFade>
				<BlurFade delay={0.3} once class="flex w-full flex-col gap-1.5 px-2">
					<MenuButtons />
				</BlurFade>
			</div>
			<div class="mt-14 flex w-full flex-col xl:w-4/5">
				{@render children()}
			</div>
		</div>
	{/if}
</div>
