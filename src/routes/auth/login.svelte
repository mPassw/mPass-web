<script lang="ts">
	import { BlurFade } from '@/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { userState } from '@/state/userState.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	import { login } from '@/auth/login.svelte';
	import { goto } from '$app/navigation';

	let isLoading: boolean = $state(false);

	const handleLogin = async () => {
		try {
			isLoading = true;

			if (!userState.email || !userState.password) throw new Error();

			const token = await login();

			if (!token) throw new Error();
			userState.postLogin(token);

			await goto('/dashboard');
		} catch (err: any) {
			toast.error(err.message || 'Unknown error');
		} finally {
			isLoading = false;
		}
	};

	onMount(() => {
		userState.loadSavedEmail();
	});
</script>

<svelte:window
	onkeydown={async (e) => {
		if (e.key !== 'Enter') return;

		if (userState.authState === 'login') await handleLogin();
	}}
/>

<BlurFade delay={0.1} class="flex w-full max-w-[400px] flex-col gap-4">
	<div class="flex w-full flex-row items-center justify-center gap-2">
		<Button
			variant="ghost"
			size="icon"
			disabled={isLoading}
			onclick={() => (userState.authState = 'serverValidation')}
		>
			<Icon icon="lucide:chevron-left" />
		</Button>
		<h3 class="text-2xl font-semibold tracking-tight">Login</h3>
	</div>
	<div class="flex w-full flex-col gap-1.5">
		<Label for="email">Email<span class="text-red-600">*</span></Label>
		<Input
			bind:value={userState.email}
			disabled={isLoading}
			class="bg-white shadow-sm dark:bg-black"
			type="email"
			id="email"
			placeholder="mail@example.com"
		/>
	</div>
	<div class="flex w-full flex-col gap-1.5">
		<Label for="password">Password<span class="text-red-600">*</span></Label>
		<Input
			bind:value={userState.password}
			disabled={isLoading}
			class="bg-white shadow-sm dark:bg-black"
			type="password"
			id="password"
			placeholder="********"
		/>
	</div>
	<div class="flex flex-row justify-end">
		<Button
			disabled={isLoading}
			variant="link"
			class="text-muted-foreground"
			onclick={() => (userState.authState = 'registration')}>Register</Button
		>
		<Button disabled={isLoading} class="self-end" onclick={handleLogin}>
			{#if isLoading}
				<Icon icon="svg-spinners:pulse-3" font-size="20px" />
			{/if}
			Login
		</Button>
	</div>
</BlurFade>
