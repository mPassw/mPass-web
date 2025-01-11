<script lang="ts">
	import { BlurFade } from '@/animations/blurFade';
	import { register } from '@/auth/register.svelte';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { userState } from '@/state/userState.svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';

	let isLoading: boolean = $state(false);

	let registerEmail: string = $state('');
	let registerDisplayName: string = $state('');
	let registerPassword: string = $state('');
	let registerPasswordRepeat: string = $state('');

	const handleRegister = async () => {
		try {
			if (!registerEmail || !registerPassword || !registerPasswordRepeat) {
				toast.error('Please fill out all fields');
				return;
			}

			if (registerPassword.length < 8) {
				toast.error('Password must be at least 8 characters long');
				return;
			}

			if (!/[a-zA-Z]/.test(registerPassword)) {
				toast.error('Password must contain at least one letter');
				return;
			}

			if (!/\d/.test(registerPassword)) {
				toast.error('Password must contain at least one number');
				return;
			}

			if (!/[!@#$%^&*(),.?":{}|<>]/.test(registerPassword)) {
				toast.error('Password must contain at least one special character');
				return;
			}

			if (registerPassword !== registerPasswordRepeat) {
				toast.error('Passwords do not match');
				return;
			}

			isLoading = true;

			const res = await register(registerEmail, registerDisplayName, registerPassword);

			if (res.status === 409) {
				toast.error('Email already in use');
				return;
			}

			const data = await res.json();

			if (data.error) {
				throw new Error(data.error);
			}

			if (data.emailVerificationRequired) {
				toast.success('Account created. Please verify your email address');
				userState.authState = 'emailVerification';
			} else {
				toast.success('Account created. You can now login');
				userState.authState = 'login';
			}

			userState.email = registerEmail;
		} catch {
			toast.error('Unknown error');
		} finally {
			isLoading = false;
		}
	};
</script>

<svelte:window
	onkeydown={async (e) => {
		if (e.key !== 'Enter') return;

		if (userState.authState === 'registration') await handleRegister();
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
		<h3 class="text-2xl font-semibold tracking-tight">Register</h3>
	</div>
	<div class="flex w-full flex-col gap-1.5">
		<Label for="email">Email<span class="text-red-600">*</span></Label>
		<Input
			bind:value={registerEmail}
			disabled={isLoading}
			class="bg-white shadow-sm dark:bg-black"
			type="email"
			id="email"
			placeholder="mail@example.com"
		/>
	</div>
	<div class="flex w-full flex-col gap-1.5">
		<Label for="display-name">Display name</Label>
		<Input
			bind:value={registerDisplayName}
			disabled={isLoading}
			class="bg-white shadow-sm dark:bg-black"
			type="text"
			id="display-name"
			placeholder="crocondine"
		/>
	</div>
	<div class="flex w-full flex-col gap-1.5">
		<Label for="password">Password<span class="text-red-600">*</span></Label>
		<Input
			bind:value={registerPassword}
			disabled={isLoading}
			class="bg-white shadow-sm dark:bg-black"
			type="password"
			id="password"
			placeholder="********"
		/>
	</div>
	<div class="flex w-full flex-col gap-1.5">
		<Label for="password-repeat">Repeat Password<span class="text-red-600">*</span></Label>
		<Input
			bind:value={registerPasswordRepeat}
			disabled={isLoading}
			class="bg-white shadow-sm dark:bg-black"
			type="password"
			id="password-repeat"
			placeholder="********"
		/>
	</div>
	<div class="flex flex-row justify-end">
		<Button
			disabled={isLoading}
			variant="link"
			class="text-muted-foreground"
			onclick={() => (userState.authState = 'login')}>Login</Button
		>
		<Button disabled={isLoading} class="self-end" onclick={handleRegister}>
			{#if isLoading}
				<Icon icon="svg-spinners:pulse-3" font-size="20px" />
			{/if}
			Register
		</Button>
	</div>
</BlurFade>
