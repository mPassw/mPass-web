<script lang="ts">
	import { fixUrl, isServerValid } from '@/auth';
	import { BlurFade } from '@/components/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { currentAuthState, instanceUrl } from '@/shared';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let isLoading: boolean = $state(false);

	let serverUrl: string = $state('');

	const checkServer = async () => {
		if (!serverUrl) return;

		isLoading = true;
		serverUrl = fixUrl(serverUrl);
		if (!(await isServerValid(serverUrl))) {
			isLoading = false;
			toast.error('Invalid server URL');
			return;
		}

		toast.success('URL is valid');
		localStorage.setItem('savedServerUrl', serverUrl);

		isLoading = false;
		$currentAuthState = 'login';
		$instanceUrl = serverUrl;
	};

	onMount(async () => {
		serverUrl = localStorage.getItem('savedServerUrl') || '';
	});
</script>

<svelte:document
	onkeydown={async (e) => {
		if (e.key !== 'Enter') return;

		if ($currentAuthState === 'server') await checkServer();
	}}
/>

<BlurFade delay={0.1} class="flex w-full max-w-[400px] flex-col gap-4">
	<div class="text-center">
		<h3 class="text-2xl font-semibold tracking-tight">Server URL</h3>
	</div>
	<div class="flex w-full flex-col gap-1.5">
		<Input
			bind:value={serverUrl}
			disabled={isLoading}
			class="bg-white shadow-sm dark:bg-black"
			type="text"
			id="server-url"
			placeholder="https://mpass.dev"
		/>
		<p class="text-sm text-muted-foreground">Enter the URL of your mPass instance</p>
	</div>
	<Button disabled={isLoading} class="self-end" onclick={checkServer}>
		{#if isLoading}
			<Icon icon="svg-spinners:pulse-3" font-size="20px" />
		{/if}
		Next
	</Button>
</BlurFade>
