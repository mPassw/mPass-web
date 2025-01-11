<script lang="ts">
	import { BlurFade } from '@/animations/blurFade';
	import type { PasswordBase } from '@/state/passwordsState.svelte';
	import NewPasswordAuthData from './newPasswordAuthData.svelte';
	import NewPasswordTitle from './newPasswordTitle.svelte';
	import NewPasswordWebsites from './newPasswordWebsites.svelte';
	import NewPasswordNote from './newPasswordNote.svelte';
	import { Button } from '@/components/ui/button';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { createPassword } from '@/passwords/createPassword.svelte';
	import { goto } from '$app/navigation';

	let isLoading: boolean = $state(false);

	let newPassword: PasswordBase = $state({
		title: '',
		login: '',
		password: '',
		websites: [''],
		note: '',
		salt: '',
		nonce: ''
	});

	const savePassword = async () => {
		try {
			if (!newPassword.title) {
				toast.error('Title is required');
				return;
			}

			if (!newPassword.login && !newPassword.password && !newPassword.note) {
				toast.error(
					"At least one of the following fields is required: 'Login', 'Password', 'Note'"
				);
				return;
			}

			isLoading = true;

			await createPassword(newPassword);

			await goto('/dashboard');
			toast.success('Password saved');
		} catch {
			toast.error('Failed to save password');
		} finally {
			isLoading = false;
		}
	};
</script>

<BlurFade delay={0.1} once class="flex w-full flex-col gap-2 p-4 pb-20 xl:pb-0">
	<div class="flex flex-row items-center justify-between gap-2">
		<Button variant="secondary" href="/dashboard" disabled={isLoading}>
			<Icon icon="lucide:chevron-left" font-size="18" />
			Back
		</Button>
		<h2 class="self-center text-lg font-semibold tracking-tight md:text-xl">New Password</h2>
		<Button onclick={savePassword} disabled={isLoading}>
			<Icon icon="lucide:save" font-size="18" />
			Save
		</Button>
	</div>
	<NewPasswordTitle {newPassword} {isLoading} />
	<NewPasswordAuthData {newPassword} {isLoading} />
	<NewPasswordWebsites {newPassword} {isLoading} />
	<NewPasswordNote {newPassword} {isLoading} />
</BlurFade>
