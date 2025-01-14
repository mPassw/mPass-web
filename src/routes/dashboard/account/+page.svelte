<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import { BlurFade } from '@/animations/blurFade';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { goto } from '$app/navigation';
	import { passwordsState } from '@/state/passwordsState.svelte';
	import { userState } from '@/state/userState.svelte';
	import { deauthorizeSessions } from '@/user/deauthorizeSessions.svelte';
	import { updateUsername } from '@/user/updateUsername.svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { updateEmail, updateEmailGetCode } from '@/user/updateEmail.svelte';
	import { generateSaltAndVerifier } from '@/auth/register.svelte';

	let isLoading: boolean = $state(false);

	let masterPassword: string = $state('');

	let newEmail: string = $state('');
	let newEmailVeirificationCode: number | null = $state(null);

	let newUsername: string = $state('');

	const requestEmailVerificationCode = async () => {
		try {
			isLoading = true;

			await updateEmailGetCode();
			toast.success('Verification code sent');
		} catch (err: any) {
			toast.error(err.message || 'Unknown error');
		} finally {
			isLoading = false;
		}
	};

	const _updateEmail = async () => {
		try {
			isLoading = true;

			if (!newEmail) {
				toast.error('New email is required');
				return;
			}

			if (!newEmailVeirificationCode) {
				toast.error('Verification code is required');
				return;
			}

			if (!masterPassword) {
				toast.error('Master password is required');
				return;
			}

			const { salt, verifier } = await generateSaltAndVerifier(newEmail, masterPassword);
			await updateEmail(
				newEmail,
				newEmailVeirificationCode.toString(),
				salt,
				btoa(verifier),
				masterPassword
			);
			await deauthorizeSessions();

			userState.reset();
			await goto('/auth');

			toast.success('Email updated');
		} catch (err: any) {
			toast.error(err.message || 'Unknown error');
		} finally {
			isLoading = false;
		}
	};

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

	let isDeauthorizeDialogOpen: boolean = $state(false);
	const deauthorize = async () => {
		try {
			isLoading = true;

			await deauthorizeSessions();

			userState.reset();
			isDeauthorizeDialogOpen = false;

			await goto('/auth');
			toast.success('All sessions deauthorized');
		} catch (err: any) {
			toast.error(err.message || 'Unknown error');
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
				{userState.username?.length ? userState.username : 'none'}
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
				<div class="flex w-full flex-col gap-2 pt-2">
					<div class="grid w-full items-center gap-1.5">
						<Label for="new-email">New Email</Label>
						<Input
							bind:value={newEmail}
							disabled={isLoading}
							type="email"
							id="new-email"
							placeholder="mail@example.com"
						/>
					</div>

					<div class="grid w-full items-center gap-1.5">
						<Label for="new-email">Verification Code</Label>
						<Input
							bind:value={newEmailVeirificationCode}
							disabled={isLoading}
							type="number"
							id="new-email-verification-code"
							placeholder="123456"
						/>
					</div>
					<Button
						class="self-start"
						variant="link"
						disabled={isLoading}
						onclick={requestEmailVerificationCode}
					>
						<Icon icon="lucide:mail-plus" font-size="20" />
						Request Code
					</Button>

					<div class="grid w-full items-center gap-1.5">
						<Label for="master-password">Master Password</Label>
						<Input
							bind:value={masterPassword}
							disabled={isLoading}
							type="password"
							id="master-password"
							placeholder="********"
						/>
					</div>

					<Button variant="link" class="self-start" disabled={isLoading} onclick={_updateEmail}>
						<Icon icon="lucide:save" font-size="20" />
						Save
					</Button>
					<p class="text-sm text-muted-foreground">
						Changing your email will log you out of all devices. You will need to log in again on
						each device.
					</p>
				</div>
			</Tabs.Content>
			<Tabs.Content value="username">
				<div class="flex w-full flex-col gap-2 pt-2">
					<div class="grid w-full items-center gap-1.5">
						<Label for="new-username"
							>New Username <span class="text-muted-foreground">(leave empty to remove)</span
							></Label
						>
						<Input
							bind:value={newUsername}
							disabled={isLoading}
							type="text"
							id="new-username"
							placeholder="coolname69420"
						/>
					</div>

					<div class="grid w-full items-center gap-1.5">
						<Label for="master-password">Master Password</Label>
						<Input
							bind:value={masterPassword}
							disabled={isLoading}
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
		<div class="flex flex-row flex-wrap items-start gap-2">
			<Dialog.Root bind:open={isDeauthorizeDialogOpen}>
				<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
					<Icon icon="lucide:shield-alert" font-size="20" />
					Deauthorize Sessions
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
						<Dialog.Description>
							Deauthorizing all sessions will log you out of all devices. You will need to log in
							again on each device.
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer class="gap-1.5">
						<Button variant="destructive" onclick={deauthorize}>Deauthorize</Button>
						<Button variant="secondary" onclick={() => (isDeauthorizeDialogOpen = false)}>
							Cancel
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
			<Button variant="destructive">
				<Icon icon="material-symbols:password-2-off-rounded" font-size="20" />
				Delete Passwords
			</Button>
			<Button variant="destructive" disabled>
				<Icon icon="lucide:user-round-x" font-size="20" />
				Delete Account
			</Button>
		</div>
	</div>
</BlurFade>
