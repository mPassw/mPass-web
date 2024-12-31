<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import { Button } from '@/components/ui/button';
	import { userData, authTimeoutId, currentAuthState, servicePasswords, password } from '@/shared';
	import type { UserData } from '@/user';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';

	const logOut = async () => {
		sessionStorage.removeItem('authToken');

		if ($authTimeoutId) {
			clearTimeout($authTimeoutId);
		}

		$currentAuthState = 'server';
		$userData = {} as UserData;
		$servicePasswords = [];
		$password = '';
		await goto('/auth');
		toast.success('Logged out');
	};
</script>

<Button
	href="/dashboard"
	variant="ghost"
	class="flex justify-start {page.url.pathname === '/dashboard' ? 'bg-accent' : ''}"
>
	<Icon icon="lucide:layout-dashboard" font-size="20px" />
	Overview
</Button>
<Button
	href="/dashboard/passwords"
	variant="ghost"
	class="flex justify-start {page.url.pathname === '/dashboard/passwords' ? 'bg-accent' : ''}"
>
	<Icon icon="material-symbols:password-rounded" font-size="20px" />
	Passwords
</Button>
<Button
	href="/dashboard/settings"
	variant="ghost"
	class="flex justify-start {page.url.pathname === '/dashboard/settings' ? 'bg-accent' : ''}"
>
	<Icon icon="lucide:settings" font-size="20px" />
	Settings
</Button>
{#if $userData.admin}
	<Button
		href="/dashboard/admin"
		variant="ghost"
		class="flex justify-start {page.url.pathname === '/dashboard/admi' ? 'bg-accent' : ''}"
	>
		<Icon icon="lucide:wrench" font-size="20px" />
		Admin
	</Button>
{/if}
<Button variant="ghost" class="flex justify-start" onclick={logOut}>
	<Icon icon="lucide:log-out" font-size="20px" />
	Log Out
</Button>
