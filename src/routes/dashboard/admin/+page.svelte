<script lang="ts">
	import { goto } from '$app/navigation';
	import { sendTestEmail } from '@/admin/smtp.svelte';
	import { getUsers, type UserData } from '@/admin/users.svelte';
	import { BlurFade } from '@/animations/blurFade';
	import { Badge } from '@/components/ui/badge';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { userState } from '@/state/userState.svelte';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let isLoading: boolean = $state(false);

	let isLoadingUsers: boolean = $state(true);

	let smtpEmail: string = $state(userState.email);

	let users: UserData[] = $state([]);

	const smtpTest = async () => {
		try {
			isLoading = true;

			const res = await sendTestEmail(smtpEmail);

			if (!res.ok) {
				if (res.status === 400) {
					toast.error('Invalid email');
				} else if (res.status === 401) {
					toast.error('Unauthorized');
				} else if (res.status === 403) {
					toast.error('No permission');
				} else {
					throw new Error('Unknown error');
				}

				return;
			}

			toast.success('Email sent');
		} catch {
			toast.error('Unknown error');
		} finally {
			isLoading = false;
		}
	};

	const loadUsers = async () => {
		try {
			isLoadingUsers = true;

			users = [];
			users = await getUsers();
		} catch {
			toast.error('Failed to load users');
		} finally {
			isLoadingUsers = false;
		}
	};

	onMount(async () => {
		if (!userState.isAdmin) {
			await goto('/dashboard');
			return;
		}

		await loadUsers();
	});
</script>

<BlurFade delay={0.1} once class="flex w-full flex-col gap-4 p-4 pb-20 xl:pb-0">
	<div class="flex flex-col gap-2 rounded-md border bg-white p-2 shadow-sm dark:bg-black">
		<h2 class="text-xl font-semibold">SMTP</h2>
		<div class="flex w-full flex-col items-start gap-1">
			<h3 class="font-medium">Send test email</h3>
			<Input
				bind:value={smtpEmail}
				disabled={isLoading}
				placeholder="mail@example.com"
				type="email"
				class="w-full"
			/>
			<Button variant="link" onclick={smtpTest} disabled={isLoading}>
				<Icon icon="lucide:mail-plus" font-size="20" />
				Send
			</Button>
		</div>
	</div>

	<div class="flex flex-col rounded-md border bg-white p-2 shadow-sm dark:bg-black">
		<div class="flex flex-row justify-between">
			<h2 class="text-xl font-semibold">Users</h2>
			<Button variant="secondary" size="icon" disabled={isLoadingUsers} onclick={loadUsers}>
				<Icon icon="lucide:refresh-cw" font-size="20" />
			</Button>
		</div>
		{#if isLoadingUsers}
			<Icon icon="svg-spinners:pulse-3" font-size="48" class="mt-4 w-full items-center" />
		{:else}
			<div class="mt-2 flex w-full flex-row">
				<p class="ml-2 w-1/3 text-center">Email</p>
				<p class="w-1/3 text-center">Passwords</p>
				<p class="mr-2 w-1/3 text-center md:mr-0">Role</p>
				<p class="mr-2 hidden w-1/3 text-center md:block">Status</p>
			</div>
			<div class="flex w-full flex-col items-center gap-1.5">
				{#each users as user}
					<a
						href={`/dashboard/admin/users/${user.id}`}
						class="flex h-[50px] w-full select-none flex-row items-center gap-2 rounded-md border p-2 duration-200 hover:bg-accent dark:hover:bg-accent"
					>
						<p class="w-1/3 truncate text-center">{user.email}</p>
						<p class="w-1/3 truncate text-center">{user.passwordsCount}</p>
						<div class="w-1/3 truncate text-center">
							<Badge variant="secondary">{user.admin ? 'Admin' : 'User'}</Badge>
						</div>
						<div class="hidden w-1/3 truncate text-center md:block">
							<Badge
								variant="outline"
								class={user.emailVerified
									? 'border-green-600'
									: 'border-[#dc7609] dark:border-[#f3cf58]'}
							>
								{user.emailVerified ? 'Verified' : 'Not verified'}
							</Badge>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</BlurFade>
