<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import {
		getUser,
		toggleEmailVerification,
		toggleRole,
		type UserData
	} from '@/admin/users.svelte';
	import { type PageData } from './$types';
	import { BlurFade } from '@/animations/blurFade';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { Badge } from '@/components/ui/badge';
	import { Button } from '@/components/ui/button';
	import { userState } from '@/state/userState.svelte';

	let { data }: { data: PageData } = $props();
	let isLoading: boolean = $state(true);
	let isButtonLoading: boolean = $state(false);

	let user: UserData | null = $state(null);

	const toggleEmail = async () => {
		try {
			if (!user) return;

			isButtonLoading = true;
			await toggleEmailVerification(user.id);

			if (user.emailVerified) {
				toast.success('Email unverified');
			} else {
				toast.success('Email verified');
			}

			user.emailVerified = !user.emailVerified;
		} catch {
			toast.error('Failed to toggle email verification');
		} finally {
			isButtonLoading = false;
		}
	};

	const _toggleRole = async () => {
		try {
			if (!user) return;

			isButtonLoading = true;
			await toggleRole(user.id);

			if (user.admin) {
				toast.success('User is no longer admin');
			} else {
				toast.success('User is now admin');
			}

			user.admin = !user.admin;
		} catch {
			toast.error('Failed to toggle user role');
		} finally {
			isButtonLoading = false;
		}
	};

	onMount(async () => {
		try {
			isLoading = true;

			user = null;
			user = await getUser(Number(data.userId));
		} catch {
			toast.error('Failed to load user data');
		} finally {
			isLoading = false;
		}
	});
</script>

<BlurFade
	delay={0.1}
	once
	class="flex h-screen w-full flex-col gap-4 overflow-auto p-4 pb-20 xl:pb-0"
>
	{#if isLoading}
		<div class="m-auto flex w-full items-center justify-center">
			<Icon icon="svg-spinners:pulse-3" font-size="48" />
		</div>
	{:else if user}
		<div class="flex w-full flex-col gap-2 rounded-md border bg-white p-4 dark:bg-black">
			<!-- <Avatar.Root class="h-28 w-28">
				<Avatar.Image src="" alt="" />
				<Avatar.Fallback class="text-5xl">
					{user.username?.slice(0, 2).toUpperCase() ?? user.email.slice(0, 2).toUpperCase()}
				</Avatar.Fallback>
			</Avatar.Root> -->
			<div class="flex flex-row items-center gap-1.5">
				<Badge variant="secondary">
					{user.admin ? 'Admin' : 'User'}
				</Badge>
				<Badge variant={user.emailVerified ? 'secondary' : 'destructive'}>
					{user.emailVerified ? 'Verified' : 'Not verified'}
				</Badge>
			</div>
			<div class="flex w-full flex-col items-start">
				<h2 class="text-xl font-semibold">Email</h2>
				<p class="text-muted-foreground">{user.email}</p>
			</div>
			<div class="flex w-full flex-col items-start">
				<h2 class="text-xl font-semibold">Username</h2>
				<p class="text-muted-foreground">{user.username ?? 'none'}</p>
			</div>
			<div class="flex w-full flex-col items-start">
				<h2 class="text-xl font-semibold">Total passwords saved</h2>
				<p class="text-muted-foreground">{user.passwordsCount}</p>
			</div>
			<div class="flex w-full flex-col items-start gap-1">
				<h2 class="text-xl font-semibold">Actions</h2>
				<div class="flex w-full flex-row flex-wrap items-start gap-1.5">
					<Button
						variant="secondary"
						disabled={isButtonLoading || user.id === userState.id}
						onclick={_toggleRole}
					>
						<Icon icon="lucide:user-round-cog" font-size="20" />
						To {user.admin ? 'User' : 'Admin'}
					</Button>
					<Button
						variant="secondary"
						disabled={isButtonLoading || (user.id === userState.id && user.emailVerified)}
						onclick={toggleEmail}
					>
						<Icon icon="lucide:badge-check" font-size="20" />
						{user.emailVerified ? 'Unverify' : 'Verify'}
					</Button>
					<Button variant="destructive" disabled={isButtonLoading || user.id === userState.id}>
						<Icon icon="lucide:trash" font-size="20" />
						Remove user
					</Button>
				</div>
			</div>
		</div>
		<div class="flex w-full flex-col gap-1 rounded-md border bg-white p-4 dark:bg-black">
			<p class="text-sm text-muted-foreground">User ID: {user.id}</p>
			<p class="text-sm text-muted-foreground">
				Account created: {new Date(user.createdAt).toLocaleString()}
			</p>
			{#if user.lastLogin}
				<p class="text-sm text-muted-foreground">
					Last login: {new Date(user.lastLogin).toLocaleString()}
				</p>
			{/if}
		</div>
	{:else}{/if}
</BlurFade>
