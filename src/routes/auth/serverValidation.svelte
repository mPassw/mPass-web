<script lang="ts">
	import { BlurFade } from '@/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { userState } from '@/state/userState.svelte';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let isLoading: boolean = $state(false);

	const checkServer = async () => {
		try {
			isLoading = true;

			if (!userState.serverUrl.match(/^https?:\/\//)) {
				userState.serverUrl = `http://${userState.serverUrl}`;
			}

			await isServerValid();
		} catch {
			toast.error('Invalid server URL');
		} finally {
			isLoading = false;
		}
	};

	const isServerValid = async (): Promise<void> => {
		if (!userState.serverUrl) throw new Error('Invalid server URL');

		const res = await fetch(`${userState.serverUrl}/`, {
			method: 'GET'
		});

		if (!res.ok) throw new Error('Invalid server URL');

		if (!res.headers.get('x-mpass-instance')) throw new Error('Invalid server URL');

		toast.success('URL is valid');

		userState.authState = 'login';
		userState.saveServerUrl();
	};

	onMount(() => {
		userState.loadSavedServerUrl();
	});
</script>

<svelte:window
	onkeydown={async (e) => {
		if (e.key !== 'Enter') return;

		if (userState.authState === 'serverValidation') await checkServer();
	}}
/>

<BlurFade delay={0.1} once class="flex w-full max-w-[400px] flex-col gap-4">
	<div class="text-center">
		<h3 class="text-2xl font-semibold tracking-tight">Server URL</h3>
		<p class="text-sm text-muted-foreground">Enter the URL of your mPass instance</p>
	</div>
	<div class="flex w-full flex-col gap-1.5">
		<Input
			bind:value={userState.serverUrl}
			disabled={isLoading}
			class="bg-white shadow-sm dark:bg-black"
			type="text"
			id="server-url"
			placeholder="https://mpass.dev"
		/>
	</div>
	<Button disabled={isLoading} class="self-end" onclick={checkServer}>
		{#if isLoading}
			<Icon icon="svg-spinners:pulse-3" font-size="20px" />
		{/if}
		Next
	</Button>
</BlurFade>
