<script lang="ts">
	import { BlurFade } from '@/components/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { currentAuthState, instanceUrl, email as storeEmail } from '@/shared';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { register } from '@/auth/register';

	let isLoading: boolean = $state(false);

	let email: string = $state('');
	let password: string = $state('');
	let passwordRepeat: string = $state('');

	const clearFields = () => {
		email = '';
		password = '';
		passwordRepeat = '';
	};

	const handleRegister = async () => {
		try {
			isLoading = true;

			if (!email || !password || !passwordRepeat) {
				toast.error('Please fill in all fields');
				return;
			}

			if (password !== passwordRepeat) {
				toast.error('Passwords do not match');
				return;
			}

			const res = await register(email, password, $instanceUrl);
			const data = await res.json();

			if (!res.ok) {
				if (res.status === 409) {
					toast.error('Email already in use');
					return;
				} else {
					toast.error('Unknown error. Please try again later');
					return;
				}
			}

			if (data.emailVerificationRequired) {
				toast.success('Account created. Please verify your email address');

				localStorage.setItem('savedEmail', email);

				$currentAuthState = 'email';
			} else {
				toast.success('Account created. You can now login');

				$currentAuthState = 'login';
			}

			$storeEmail = email;
			clearFields();
		} catch {
			toast.error('Unknown error. Please try again later');
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

		await handleRegister();
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
		<h3 class="text-2xl font-semibold tracking-tight">Register</h3>
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
			bind:value={password}
			disabled={isLoading}
			class="bg-white shadow-sm dark:bg-black"
			type="password"
			id="password"
			placeholder="********"
		/>
	</div>
	<div class="flex w-full flex-col gap-1.5">
		<Label for="password">Repeat Password</Label>
		<Input
			bind:value={passwordRepeat}
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
			onclick={() => ($currentAuthState = 'login')}
			class="text-muted-foreground">Login</Button
		>
		<Button disabled={isLoading} class="self-end" onclick={handleRegister}>
			{#if isLoading}
				<Icon icon="svg-spinners:pulse-3" font-size="20px" />
			{/if}
			Register
		</Button>
	</div>
</BlurFade>
