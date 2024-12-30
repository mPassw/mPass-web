<script lang="ts">
	import { BlurFade } from '@/components/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { getPasswords, type ServicePassword } from '@/passwords';
	import { instanceUrl, servicePasswords, userData } from '@/shared';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let isLoadingPasswords: boolean = $state(true);

	const loadPasswords = async () => {
		isLoadingPasswords = true;
		$servicePasswords = await getPasswords($instanceUrl, {
			orderBy: 'createdAt',
			orderDirection: 'desc'
		});
		isLoadingPasswords = false;
	};

	onMount(async () => {
		try {
			await loadPasswords();
		} catch {
			toast.error('Failed to load passwords');
		}
	});
</script>

<main class="flex h-screen w-full p-4">
	<div class="flex w-full flex-col gap-4">
		<BlurFade delay={0.3} once class="flex flex-col">
			<h1 class="text-3xl font-bold lg:text-4xl">Dashboard</h1>
			<p class="text-muted-foreground">Overview of your password manager</p>
		</BlurFade>
		<BlurFade delay={0.4} once class="flex flex-row gap-2">
			<div
				class="flex w-1/2 flex-col items-start rounded-md border bg-white p-2 shadow-sm dark:bg-black md:p-8"
			>
				<h4 class="text-lg font-semibold tracking-tight">Total Passwords</h4>
				<p class="text-2xl font-bold">{$servicePasswords.length}</p>
			</div>
			<div
				class="flex w-1/2 flex-col items-start rounded-md border bg-white p-2 shadow-sm dark:bg-black md:p-8"
			>
				<h4 class="text-lg font-semibold tracking-tight">Last Login</h4>
				<p class="text-2xl font-bold">{new Date($userData.lastLogin).toLocaleString()}</p>
			</div>
		</BlurFade>
		<BlurFade delay={0.5} once class="flex w-full flex-row justify-between gap-2">
			<div>
				<Button>Add Password</Button>
				<Button variant="secondary">Export</Button>
			</div>
			<Button variant="secondary" size="icon" onclick={loadPasswords} disabled={isLoadingPasswords}>
				<Icon icon="lucide:refresh-ccw" />
			</Button>
		</BlurFade>
		{#if isLoadingPasswords}
			<div class="mt-24 flex w-full justify-center">
				<Icon icon="svg-spinners:pulse-multiple" font-size="64px" />
			</div>
		{:else if $servicePasswords.length === 0}
			<div class="mt-4 flex flex-row items-center justify-center gap-2">
				<Icon icon="tabler:database-x" font-size="24px" />
				<h4 class="text-xl font-semibold tracking-tight">No passwords found</h4>
			</div>
		{:else}
			<BlurFade
				delay={0.3}
				once
				class="flex w-full flex-col items-start rounded-md border bg-white p-2 shadow-sm dark:bg-black"
			>
				<div class="flex w-full flex-row items-center space-x-2 px-2">
					<div class="w-[20px]"></div>
					<p class="w-[30%]">Title</p>
					<p class="w-[50%]">Login</p>
					<p class="hidden w-[15%] md:block">Created</p>
				</div>
				<Separator class="mt-2" />
				<div class="my-7 flex w-full flex-col items-start space-y-8">
					{#each $servicePasswords.slice(0, 5) as password, index}
						<div class="flex w-full items-center space-x-2 px-2">
							<Icon icon="devicon:google" font-size="20px" />
							<p class="w-[30%] truncate">{password.title}</p>
							<div class="flex w-[50%] items-center justify-start gap-2">
								<p class="truncate">{password.login}</p>
							</div>
							<div class="hidden w-[15%] md:flex">
								<p>{new Date(password.createdAt).toLocaleString()}</p>
							</div>
						</div>
						{#if index !== 4}
							<Separator />
						{/if}
					{/each}
				</div>
			</BlurFade>
		{/if}
	</div>
</main>
