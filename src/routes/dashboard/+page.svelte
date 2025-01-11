<script lang="ts">
	import Icon from '@iconify/svelte';
	import { BlurFade } from '@/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { getPasswords } from '@/passwords/getPasswords.svelte';
	import { passwordsState } from '@/state/passwordsState.svelte';
	import { userState } from '@/state/userState.svelte';
	import PasswordCard from './passwordCard.svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let isLoading: boolean = $state(false);

	let search: string = $state('');

	const filteredPasswords = $derived(
		passwordsState.passwords.filter(
			(password) =>
				password.title.toLowerCase().includes(search.toLowerCase()) ||
				password.websites.some((website) => website.toLowerCase().includes(search.toLowerCase()))
		)
	);
</script>

<BlurFade delay={0.1} once class="flex w-full flex-col gap-2 p-4 pb-20 xl:pb-0">
	{#if !userState.isEmailVerified}
		<div
			class="flex h-[50px] w-full items-center justify-center rounded-md border-[#fdf5d3] bg-[#fffcf0] shadow dark:border-[#3d3d00] dark:bg-[#1d1f00]"
		>
			<Button
				variant="link"
				class="flex items-center gap-2 text-center text-lg font-semibold tracking-tight text-[#dc7609] dark:text-[#f3cf58]"
				onclick={async () => {
					const currentEmail = userState.email;
					const currentServerUrl = userState.serverUrl;
					userState.reset();
					userState.serverUrl = currentServerUrl;
					userState.email = currentEmail;
					userState.authState = 'emailVerification';
					await goto('/auth');
				}}
			>
				<Icon icon="lucide:info" font-size="24" />
				<p>Verify your email to add passwords</p>
			</Button>
		</div>
	{/if}
	<div class="flex flex-row items-center gap-2">
		<Input
			bind:value={search}
			disabled={isLoading}
			placeholder="Search by title or website"
			class="bg-white shadow-sm dark:bg-black"
			type="text"
		/>
	</div>
	<div class="flex w-full flex-row items-center gap-2">
		<Button
			disabled={isLoading || !userState.isEmailVerified}
			variant="default"
			onclick={async () => await goto('/dashboard/passwords/new')}
		>
			<Icon icon="lucide:plus" font-size="20" />
			Add Password
		</Button>
		<Button
			disabled={isLoading}
			variant="secondary"
			size="icon"
			onclick={() => {
				isLoading = true;
				getPasswords()
					.then(() => {
						isLoading = false;
					})
					.catch(() => {
						toast.error('Failed to fetch passwords');
						isLoading = false;
					});
			}}
		>
			<Icon icon="lucide:refresh-cw" font-size="20" />
		</Button>
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
			<!-- <div class="flex w-full flex-row items-center space-x-2 p-2">
				<div class="w-1/12 text-center font-semibold tracking-tight"></div>
				<p class="w-1/2 text-start font-semibold tracking-tight">Title</p>
				<p class="w-1/2 text-start font-semibold tracking-tight">Created at</p>
			</div> -->
			<div class="flex flex-col gap-2">
				{#each filteredPasswords as password}
					<PasswordCard {password} />
				{/each}
			</div>
		</BlurFade>
	{/if}
</BlurFade>
