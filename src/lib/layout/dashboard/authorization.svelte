<script>
	import { currentAuthState } from '@/shared';
	import ServerValidation from './serverValidation.svelte';
	import Login from './login.svelte';
	import Register from './register.svelte';
	import EmailVerification from './emailVerification.svelte';
</script>

<div class="m-auto flex w-full max-w-[1000px] flex-row items-center justify-center space-x-4 px-4">
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
