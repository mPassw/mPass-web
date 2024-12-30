<script lang="ts">
	import { goto } from '$app/navigation';
	import { EmailVerification, Login, Register, ServerValidation } from '@/layout/dashboard';
	import { currentAuthState } from '@/shared';
	import { onMount } from 'svelte';

	onMount(async () => {
		if ($currentAuthState === 'loggedin') {
			await goto('/dashboard');
			return;
		}
	});
</script>

<div
	class="m-auto flex h-screen w-full max-w-[1000px] flex-row items-center justify-center space-x-4 px-4"
>
	{#if $currentAuthState === 'server'}
		<ServerValidation />
	{:else if $currentAuthState === 'login'}
		<Login />
	{:else if $currentAuthState === 'register'}
		<Register />
	{:else if $currentAuthState === 'email'}
		<EmailVerification />
	{/if}
</div>
