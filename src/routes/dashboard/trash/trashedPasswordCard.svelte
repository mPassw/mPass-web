<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import { type TrashedPassword } from '@/state/passwordsState.svelte';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { decryptPassword } from '@/passwords/decryptPassword.svelte';
	import { toast } from 'svelte-sonner';
	import { movePasswordToTrash } from '@/passwords/trash.svelte';
	import { Button, buttonVariants } from '@/components/ui/button';

	let {
		password,
		handleRemoveFromTrash,
		handlePermanentDelete
	}: {
		password: TrashedPassword;
		handleRemoveFromTrash: (password: TrashedPassword) => Promise<void>;
		handlePermanentDelete: (password: TrashedPassword) => Promise<void>;
	} = $props();
	let favicon: string = $state('');

	const extractDomain = (url: string): string => {
		try {
			const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
			const hostname = new URL(urlWithProtocol).hostname;
			const parts = hostname.split('.');

			if (parts.length > 2 && parts[parts.length - 2] === 'co') {
				return parts.slice(-3).join('.');
			}

			return parts.slice(-2).join('.');
		} catch {
			return url;
		}
	};

	const handleCopy = async (text: string) => {
		if (!password.decrypted) {
			await decryptPassword(password);
		}

		await navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard');
	};

	onMount(() => {
		if (password.websites.length > 0 && password.websites[0].length > 0) {
			const domain = extractDomain(password.websites[0]);
			// favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
			// favicon = `https://api.faviconkit.com/${domain}/144`;
			// favicon = `https://logo.clearbit.com/${domain}`;
			favicon = `https://icon.horse/icon/${domain}`;
		}
	});
</script>

<div
	class="flex h-[70px] w-full select-none flex-row items-center gap-2 rounded-lg border bg-white p-2 shadow-sm duration-200 dark:bg-black"
>
	<Avatar.Root class="rounded-sm bg-transparent">
		<Avatar.Image src={favicon} alt="icon" />
		<Avatar.Fallback class="bg-transparent">
			<Icon icon="lucide:globe" font-size="24" />
		</Avatar.Fallback>
	</Avatar.Root>
	<p class="w-full truncate text-start font-semibold tracking-tight">
		{password.title}
	</p>
	<div class="flex flex-row items-end gap-2">
		<Tooltip.Provider delayDuration={0}>
			<Tooltip.Root>
				<Tooltip.Trigger
					class={buttonVariants({ variant: 'secondary', size: 'icon' })}
					onclick={async () => await handleRemoveFromTrash(password)}
				>
					<Icon icon="lucide:redo-2" font-size="20" class="rotate-180" />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Restore</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
		<Tooltip.Provider delayDuration={0}>
			<Tooltip.Root>
				<Tooltip.Trigger
					class={buttonVariants({ variant: 'destructive', size: 'icon' })}
					onclick={async () => await handlePermanentDelete(password)}
				>
					<Icon icon="lucide:x" font-size="20" />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Delete</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>
</div>
