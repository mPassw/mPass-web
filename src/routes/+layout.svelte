<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import Navbar from '$lib/layout/navbar/navbar.svelte';
	import { Background } from '$lib/components/background';
	import { onMount } from 'svelte';
	import { getExp } from '@/jwt';
	import { currentAuthState, password, servicePasswords, userData } from '@/shared';
	import { toast } from 'svelte-sonner';
	import type { UserData } from '@/user';

	let { children } = $props();

	const getAuthState = (): void => {
		if (sessionStorage.getItem('authToken')) {
			const exp = getExp(sessionStorage.getItem('authToken')!);
			if (!exp) {
				$currentAuthState = 'server';
				return;
			}

			const currentTime = Math.floor(Date.now() / 1000);
			const timeLeft = exp - currentTime;

			if (timeLeft < 0) {
				$currentAuthState = 'server';
				return;
			}

			setTimeout(() => {
				$currentAuthState = 'server';
				$userData = {} as UserData;
				$servicePasswords = [];
				$password = '';
				sessionStorage.removeItem('authToken');
				toast.warning('Session expired');
			}, timeLeft * 1000);

			$currentAuthState = 'loggedin';
		} else {
			$currentAuthState = 'server';
		}
	};

	const clearSession = () => {
		sessionStorage.removeItem('authToken');
	};

	onMount(async () => {
		getAuthState();
	});
</script>

<svelte:window on:beforeunload={clearSession} />

<ModeWatcher />
<Toaster richColors />
<Background />
<Navbar />

{@render children()}
