<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { userState } from '@/state/userState.svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import Error from '../../+error.svelte';
	import { passwordsState } from '@/state/passwordsState.svelte';
	import { deleteAllPasswords } from '@/passwords/deleteAllPasswords.svelte';

	let isLoading: boolean = $state(false);
	let isDialogOpen: boolean = $state(false);
	let masterPassword: string = $state('');

	const handleDeletePasswords = async () => {
		try {
			isLoading = true;

			if (!masterPassword || masterPassword !== userState.password) {
				toast.error('Invalid master password');
				return;
			}

			await deleteAllPasswords();

			toast.success('Passwords deleted');
			isDialogOpen = false;
		} catch (err: any) {
			toast.error(err.message || 'Unknown error');
		} finally {
			isLoading = false;
		}
	};
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
		<Icon icon="material-symbols:password-2-off-rounded" font-size="20" />
		Delete Passwords
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Are you absolutely sure?</Dialog.Title>
			<Dialog.Description>This action cannot be undone!</Dialog.Description>
		</Dialog.Header>
		<div class="grid w-full items-center gap-1.5">
			<Label for="master-password">Master Password</Label>
			<Input
				bind:value={masterPassword}
				disabled={isLoading}
				type="password"
				placeholder="********"
				id="master-password"
			/>
		</div>
		<Dialog.Footer class="gap-1.5 md:gap-0">
			<Button variant="secondary" onclick={() => (isDialogOpen = false)} disabled={isLoading}>
				Cancel
			</Button>
			<Button variant="destructive" onclick={handleDeletePasswords} disabled={isLoading}>
				Delete
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
