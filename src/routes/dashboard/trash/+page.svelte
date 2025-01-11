<script lang="ts">
	import Icon from '@iconify/svelte';
	import { BlurFade } from '@/animations/blurFade';
	import { Input } from '@/components/ui/input';
	import { onMount } from 'svelte';
	import { getTrash } from '@/passwords/getPasswords.svelte';
	import type { TrashedPassword } from '@/state/passwordsState.svelte';
	import TrashedPasswordCard from './trashedPasswordCard.svelte';
	import { toast } from 'svelte-sonner';
	import { movePasswordFromTrash } from '@/passwords/trash.svelte';
	import { deletePassword } from '@/passwords/deletePassword.svelte';

	let isLoading: boolean = $state(true);

	let passwords: TrashedPassword[] = $state([]);

	let search: string = $state('');
	const filteredPasswords = $derived(
		passwords.filter(
			(password) =>
				password.title.toLowerCase().includes(search.toLowerCase()) ||
				password.websites.some((website) => website.toLowerCase().includes(search.toLowerCase()))
		)
	);

	const handleRemoveFromTrash = async (password: TrashedPassword) => {
		try {
			await movePasswordFromTrash(password);

			passwords = passwords.filter((p) => p.id !== password.id);

			toast.success('Removed from trash');
		} catch {
			toast.error('Failed to remove from trash');
		}
	};

	const handlePermanentDelete = async (password: TrashedPassword) => {
		try {
			await deletePassword(password.id, true);

			passwords = passwords.filter((p) => p.id !== password.id);

			toast.success('Password deleted');
		} catch {
			toast.error('Failed to permanently delete password');
		}
	};

	onMount(async () => {
		passwords = [];
		passwords = await getTrash();

		isLoading = false;
	});
</script>

<BlurFade delay={0.1} once class="flex w-full flex-col gap-2 p-4 pb-20 xl:pb-0">
	<div class="flex flex-row items-center gap-2">
		<Input
			bind:value={search}
			disabled={isLoading}
			placeholder="Search by title or website"
			class="bg-white shadow-sm dark:bg-black"
			type="text"
		/>
	</div>

	{#if isLoading}
		<div class="mx-auto mt-12">
			<Icon icon="svg-spinners:pulse-multiple" font-size="64px" />
		</div>
	{:else if filteredPasswords.length === 0}
		<div class="flex h-[50px] w-full items-center justify-center gap-1.5 rounded-md">
			<Icon icon="tabler:database-x" font-size="24" />
			<p class="text-center text-lg font-semibold tracking-tight">No passwords found</p>
		</div>
	{:else}
		<BlurFade delay={0.1} once class="flex flex-col">
			<div class="flex flex-col gap-2">
				{#each filteredPasswords as password}
					<TrashedPasswordCard {password} {handleRemoveFromTrash} {handlePermanentDelete} />
				{/each}
			</div>
		</BlurFade>
	{/if}
</BlurFade>
