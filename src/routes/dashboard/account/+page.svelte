<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index';
	import { BlurFade } from '@/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { passwordsState } from '@/state/passwordsState.svelte';
	import { userState } from '@/state/userState.svelte';
	import { updateUsername } from '@/user/updateUsername.svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';

	let isLoading: boolean = $state(false);

	let masterPassword: string = $state('');

	let newEmail: string = $state('');
	let newUsername: string = $state('');

	const _updateUsername = async () => {
		try {
			if (!masterPassword) return;

			if (masterPassword !== userState.password) {
				toast.error('Invalid master password');
				return;
			}

			isLoading = true;

			const res = await updateUsername(masterPassword, newUsername);

			if (!res.ok) {
				if (res.status === 400) {
					toast.error('Username already taken');
					return;
				} else {
					throw new Error('Failed to update username');
				}
			}

			userState.username = newUsername?.length ? newUsername : undefined;
			toast.success('Username updated');
		} catch {
			toast.error('Failed to update username');
		} finally {
			isLoading = false;
		}
	};
</script>

<BlurFade delay={0.1} once class="flex w-full flex-col gap-4 p-4 pb-20 xl:pb-0">
	<div class="flex w-full flex-col gap-2 rounded-md border bg-white p-4 shadow-md dark:bg-black">
		<div class="flex w-full flex-col">
			<h1 class="text-lg font-semibold">Email</h1>
			<p class="text-muted-foreground">{userState.email}</p>
		</div>
		<div class="flex w-full flex-col">
			<h1 class="text-lg font-semibold">Username</h1>
			<p class="text-muted-foreground">
				{userState.username ?? 'none'}
			</p>
		</div>
		<div class="flex w-full flex-col">
			<h1 class="text-lg font-semibold">Total passwords saved</h1>
			<p class="text-muted-foreground">
				{passwordsState.passwords.length}
			</p>
		</div>
	</div>

	<div class="flex w-full flex-col gap-2 rounded-md border bg-white p-4 shadow-md dark:bg-black">
		<Tabs.Root value="email" class="w-full">
			<Tabs.List class="w-full">
				<Tabs.Trigger value="email" class="w-1/2">Change Email</Tabs.Trigger>
				<Tabs.Trigger value="username" class="w-1/2">Change Username</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="email">
				<div class="flex w-full flex-col gap-4 pt-2">
					<div class="grid w-full items-center gap-1.5">
						<Label for="new-email">New Email</Label>
						<Input
							bind:value={newEmail}
							type="email"
							id="new-email"
							placeholder="mail@example.com"
						/>
					</div>

					<div class="grid w-full items-center gap-1.5">
						<Label for="master-password">Master Password</Label>
						<Input
							bind:value={masterPassword}
							type="password"
							id="master-password"
							placeholder="********"
						/>
					</div>

					<Button variant="link" class="self-start">
						<Icon icon="lucide:save" font-size="20" />
						Save
					</Button>
				</div>
			</Tabs.Content>
			<Tabs.Content value="username">
				<div class="flex w-full flex-col gap-4 pt-2">
					<div class="grid w-full items-center gap-1.5">
						<Label for="new-username"
							>New Username <span class="text-muted-foreground">(leave empty to remove)</span
							></Label
						>
						<Input
							bind:value={newUsername}
							type="text"
							id="new-username"
							placeholder="coolname69420"
						/>
					</div>

					<div class="grid w-full items-center gap-1.5">
						<Label for="master-password">Master Password</Label>
						<Input
							bind:value={masterPassword}
							type="password"
							id="master-password"
							placeholder="********"
						/>
					</div>

					<Button variant="link" class="self-start" disabled={isLoading} onclick={_updateUsername}>
						<Icon icon="lucide:save" font-size="20" />
						Save
					</Button>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>

	<div
		class="flex w-full flex-col gap-2 rounded-md border border-destructive bg-white p-4 shadow-md dark:bg-black"
	>
		<h1 class="text-lg font-semibold text-destructive">Danger Zone</h1>
		<div class="flex flex-row items-start gap-2">
			<Button variant="destructive">
				<Icon icon="material-symbols:password-2-off-rounded" font-size="20" />
				Delete Passwords
			</Button>
			<Button variant="destructive" disabled={userState.isAdmin}>
				<Icon icon="lucide:user-round-x" font-size="20" />
				Delete Account
			</Button>
		</div>
	</div>
</BlurFade>
