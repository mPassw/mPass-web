<script lang="ts">
	import { BlurFade } from '@/components/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { authTimeoutId, currentAuthState, instanceUrl, password } from '@/shared';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { login } from '@/auth';
	import { toast } from 'svelte-sonner';
	import { getExp } from '@/jwt';
	import { goto } from '$app/navigation';

	let isLoading: boolean = $state(false);

	let email: string = $state('');
	let _password: string = $state('');

	const handleLogin = async () => {
		try {
			if (!email || !_password) {
				return;
			}

			isLoading = true;

			const res = await login(email, _password, $instanceUrl);
			const data = await res.json();

			if (!data.token) {
				throw new Error();
			}

			const exp = getExp(data.token);
			if (!exp) {
				throw new Error();
			}

			const currentTime = Math.floor(Date.now() / 1000);
			const timeLeft = exp - currentTime;

			if (timeLeft < 0) {
				throw new Error();
			}

			if ($authTimeoutId) {
				clearTimeout($authTimeoutId);
			}
			$authTimeoutId = setTimeout(() => {
				$currentAuthState = 'server';
				sessionStorage.removeItem('authToken');
				toast.warning('Session expired');
				goto('/auth');
			}, timeLeft * 1000);

			localStorage.setItem('savedEmail', email);
			sessionStorage.setItem('authToken', data.token);
			$currentAuthState = 'loggedin';
			$password = _password;

			toast.success('Logged in successfully');

			await goto('/dashboard');
		} catch {
			toast.error('Invalid credentials');
		} finally {
			isLoading = false;
		}
	};

	onMount(() => {
		email = localStorage.getItem('savedEmail') || '';
	});
</script>

<svelte:document
	onkeydown={async (e) => {
		if (e.key !== 'Enter') return;

		await handleLogin();
	}}
/>

<BlurFade delay={0.1} class="flex w-full max-w-[400px] flex-col gap-4">
	<div class="flex w-full flex-row items-center justify-center gap-2">
		<Button
			variant="ghost"
			size="icon"
			disabled={isLoading}
			onclick={() => ($currentAuthState = 'server')}
		>
			<Icon icon="lucide:chevron-left" />
		</Button>
		<h3 class="text-2xl font-semibold tracking-tight">Login</h3>
	</div>
	<div class="flex w-full flex-col gap-1.5">
		<Label for="email">Email</Label>
		<Input
			bind:value={email}
			disabled={isLoading}
			class="bg-white shadow-sm dark:bg-black"
			type="email"
			id="email"
			placeholder="mail@example.com"
		/>
	</div>
	<div class="flex w-full flex-col gap-1.5">
		<Label for="password">Password</Label>
		<Input
			bind:value={_password}
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
			onclick={() => ($currentAuthState = 'register')}
			class="text-muted-foreground">Register</Button
		>
		<Button disabled={isLoading} class="self-end" onclick={handleLogin}>
			{#if isLoading}
				<Icon icon="svg-spinners:pulse-3" font-size="20px" />
			{/if}
			Login
		</Button>
	</div>
</BlurFade>
