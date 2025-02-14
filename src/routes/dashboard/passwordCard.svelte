<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu/index';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import Icon from '@iconify/svelte';
	import { type Password } from '@/state/passwordsState.svelte';
	import { onMount } from 'svelte';
	import { decryptPassword } from '@/passwords/decryptPassword.svelte';
	import { toast } from 'svelte-sonner';
	import { movePasswordToTrash } from '@/passwords/trash.svelte';
	import { getIcon } from '@/utils';

	let { password }: { password: Password } = $props();
	let favicon: string = $state('');

	const handleCopy = async (text: string) => {
		if (!password.decrypted) {
			await decryptPassword(password);
		}

		await navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard');
	};

	const handleMoveToTrash = async () => {
		try {
			await movePasswordToTrash(password.id);
			toast.success('Moved to trash');
		} catch (err: any) {
			toast.error(err.message || 'Unknown error');
		}
	};

	onMount(() => {
		if (password.websites.length > 0 && password.websites[0].length > 0) {
			favicon = getIcon(password.websites[0]);
		}
	});
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<a
			href="/dashboard/passwords/{password.id}"
			class="flex h-[70px] w-full select-none flex-row items-center gap-2 rounded-lg border bg-white p-2 shadow-sm duration-200 hover:bg-accent dark:bg-black dark:hover:bg-accent"
		>
			<Avatar.Root class="rounded-sm bg-transparent">
				<Avatar.Image src={favicon} alt="icon" />
				<Avatar.Fallback class="bg-transparent">
					<Icon icon="lucide:globe" font-size="24" />
				</Avatar.Fallback>
			</Avatar.Root>
			<p class="w-1/2 truncate text-start font-semibold tracking-tight">
				{password.title}
			</p>
			<p class="w-1/2 truncate text-start font-semibold tracking-tight">
				{new Date(password.createdAt).toLocaleDateString()}
			</p>
		</a>
	</ContextMenu.Trigger>
	<ContextMenu.Content class="bg-white dark:bg-black">
		<ContextMenu.Item
			disabled={!password.login}
			onclick={async () => {
				if (!password.login) {
					toast.error('No login found');
					return;
				}

				await handleCopy(password.login);
			}}
		>
			Copy Login
		</ContextMenu.Item>
		<ContextMenu.Item
			disabled={!password.password}
			onclick={async () => {
				if (!password.password) {
					toast.error('No password found');
					return;
				}

				await handleCopy(password.password);
			}}
		>
			Copy Password
		</ContextMenu.Item>
		<ContextMenu.Item
			disabled={!password.note}
			onclick={async () => {
				if (!password.note) {
					toast.error('No note found');
					return;
				}

				await handleCopy(password.note);
			}}
		>
			Copy Note
		</ContextMenu.Item>
		<ContextMenu.Item
			class="text-red-600"
			onclick={async () => {
				await handleMoveToTrash();
			}}
		>
			Move to Trash
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
