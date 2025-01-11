<script>
	import { userState } from '@/state/userState.svelte';
	import ServerValidation from './serverValidation.svelte';
	import Login from './login.svelte';
	import Register from './register.svelte';
	import EmailVerification from './emailVerification.svelte';
</script>

<main
	class="m-auto flex h-screen w-full max-w-[1000px] flex-row items-center justify-center space-x-4 px-4"
>
	{#if userState.authState === 'serverValidation'}
		<ServerValidation />
	{:else if userState.authState === 'login'}
		<Login />
	{:else if userState.authState === 'registration'}
		<Register />
	{:else if userState.authState === 'emailVerification'}
		<EmailVerification />
	{:else if userState.authState === '2fa'}
		2fa
	{/if}
</main>
