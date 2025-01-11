<script lang="ts">
	import type { PageData } from './$types';
	import { passwordsState, type Password } from '@/state/passwordsState.svelte';
	import { BlurFade } from '@/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { decryptPassword } from '@/passwords/decryptPassword.svelte';
	import { savePassword } from '@/passwords/savePassword.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import PasswordTitle from './passwordTitle.svelte';
	import PasswordFooter from './passwordFooter.svelte';
	import PasswordAuthData from './passwordAuthData.svelte';
	import PasswordWebsites from './passwordWebsites.svelte';
	import PasswordNote from './passwordNote.svelte';
	import { movePasswordToTrash } from '@/passwords/trash.svelte';

	let { data }: { data: PageData } = $props();

	let isLoading: boolean = $state(false);
	let password: Password | undefined = $state(passwordsState.getPassword(Number(data.passwordId)));

	if (password && !password.decrypted) {
		(async () => {
			await decryptPassword(password);
		})();
	}

	const updatePassword = async () => {
		try {
			if (!password) throw new Error('Password not found');

			if (!password.title) {
				toast.error('Title is required');
				return;
			}

			if (!password.login && !password.password && !password.note) {
				toast.error(
					"At least one of the following fields is required: 'Login', 'Password', 'Note'"
				);
				return;
			}

			isLoading = true;

			await savePassword(password);
			passwordsState.updatePassword(password);
			toast.success('Password saved');
		} catch {
			toast.error('Failed to save password');
		} finally {
			isLoading = false;
		}
	};

	const moveToTrash = async () => {
		try {
			if (!password) throw new Error('Password not found');

			isLoading = true;

			await movePasswordToTrash(password.id);
			passwordsState.removePassword(password.id);

			await goto('/dashboard');
			toast.success('Password moved to trash');
		} catch {
			toast.error('Failed to move password to trash');
		} finally {
			isLoading = false;
		}
	};
</script>

<BlurFade delay={0.1} once class="flex w-full flex-col gap-2 p-4 pb-20 xl:pb-0">
	{#if !password}
		<div class="mt-12 flex w-full flex-col items-center justify-center gap-2">
			<div
				class="flex flex-row items-center gap-2 text-center text-lg font-semibold tracking-tight"
			>
				<Icon icon="lucide:info" font-size="24" />
				<p class="text-lg font-semibold tracking-tight">Password not found</p>
			</div>
			<Button href="/dashboard" variant="secondary">
				<Icon icon="lucide:chevron-left" font-size="20" />
				Back
			</Button>
		</div>
	{:else}
		<div class="flex w-full flex-col gap-4">
			<div class="flex w-full flex-row items-center justify-between gap-2">
				<Button href="/dashboard" variant="secondary">
					<Icon icon="lucide:chevron-left" font-size="18" />
					Back
				</Button>
				<div class="flex flex-row items-center gap-2">
					<Button disabled={isLoading} variant="default" onclick={updatePassword}>
						<Icon icon="lucide:save" font-size="18" />
						Save
					</Button>
					<Button disabled={isLoading} variant="destructive" onclick={moveToTrash}>
						<Icon icon="lucide:trash" font-size="18" />
						Trash
					</Button>
				</div>
			</div>

			<PasswordTitle {password} {isLoading} />
			<PasswordAuthData {password} {isLoading} />
			<PasswordWebsites {password} {isLoading} />
			<PasswordNote {password} {isLoading} />
			<PasswordFooter {password} />
		</div>
	{/if}
</BlurFade>
